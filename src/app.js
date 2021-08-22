import fs from "fs"
import path from "path"
import cron from "node-cron"
import dotenv from "dotenv"
import express from "express"
import exphbs from "express-handlebars"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import session from "express-session"

import sessionObj from "../config/session.js"
import router from "../routes/index.js"
import trackSession from "../middleware/track-session.js"
import _ from "./utils/index.js"

const today = new Date().toDateString()
const logFile = `./logs/${today.replaceAll(" ", "_")}.txt`
const logFilePath = path.resolve(logFile)
const accessLogStream = fs.createWriteStream(logFilePath, { flags: "a" })

dotenv.config({
	path: ".env"
})

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

app.use(morgan("combined", {
	skip: (req, res) => {
		const paths = [ "/tweets", "/users" ]
		return paths.includes(req.url)
	},
	stream: accessLogStream
}))

const port = process.env.PORT
const __dirname = path.resolve()

const publicPath = path.join(__dirname, "./public")
const viewsPath = path.join(__dirname, "./views")

app.engine(
	".html",
	exphbs({
		extname: ".html",
		partialsDir: ["./views/partials/blocks", "./views/partials/ui"]
	})
)

app.set("view engine", ".html")
app.set("views", viewsPath)

app.use(express.static(publicPath))

if (process.env.NODE_ENV === "production") {
	app.set("trust proxy", 1)
	sessionObj.cookie.secure = true
}

app.use(session(sessionObj))

app.get("*", trackSession, (req, res, next) => next())

app.use("/tweets", router.tweets)
app.use("/users", router.users)
app.use("", router.pages)

cron.schedule("1 0 * * *", async () => await _.insertTweets())

app.listen(port, (err) => {
	if (err) {
		console.log("Error starting server")
	} else {
		console.log(`Server running on port ${port}`)
	}
})
