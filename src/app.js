import path from "path"
// import cron from "node-cron"
import dotenv from "dotenv"
import express from "express"
import exphbs from "express-handlebars"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import session from "express-session"

import accessLogStream from "../config/log.js"
import sessionObj from "../config/session.js"
import router from "../components/index/router.js"
import trackSession from "../middleware/track-session.js"
// import _ from "./utils/index.js"

dotenv.config({
	path: ".env"
})

const app = express()
const __dirname = path.resolve()

const publicPath = path.join(__dirname, "./public")
const viewsPath = path.join(__dirname, "./views")

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

app.engine(".html",
	exphbs({
		extname: ".html",
		partialsDir: [ "./views/partials/blocks", "./views/partials/ui" ]
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
app.use("/favorites", router.favorites)
app.use("/admin", router.admin)
app.use("", router.pages)

// cron.schedule("1 0 * * *", async () => await _.insertTweets())

export default app