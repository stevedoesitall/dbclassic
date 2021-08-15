import path from "path"
import cron from "node-cron"
import dotenv from "dotenv"
import express from "express"
import exphbs from "express-handlebars"
import cookieParser from "cookie-parser"
import session  from "express-session"
import { v4 as uuidv4 } from "uuid"

import router from "../routes/index.js"
import _ from "./utils/index.js"

dotenv.config({
	path: ".env"
})

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

const port = process.env.PORT || 8083
const __dirname = path.resolve()

const publicPath = path.join(__dirname, "./public")
const viewsPath = path.join(__dirname, "./views")

app.engine(".html", exphbs({ 
	extname: ".html", 	
	partialsDir: [
		"./views/partials/blocks",
		"./views/partials/ui"
	] 
}))

app.set("view engine", ".html")
app.set("views", viewsPath)

app.use(express.static(publicPath))

const sessionObj = {
	name: "momus_session",
	genid: () => {
		return uuidv4()
	},
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		sameSite: true
	}
}
  
if (process.env.NODE_ENV === "production") {
	app.set("trust proxy", 1)
	sessionObj.cookie.secure = true
}
  
app.use(session(sessionObj))

app.get("*", async (req, res, next) => {
	if (req.session.views) {
		req.session.views++
	} else {
		req.session.views = 1
	}
	console.log(`Total PVs: ${req.session.views}`)
	next()
})

app.use("/tweets", router.tweets)
app.use("/users", router.users)
app.use("", router.pages)

cron.schedule("1 0 * * *", async () => {
	await _.insertTweets()
})

app.listen(port, (err) => {
	if (err) {
		console.log("Error starting server")
	} else {
		console.log(`Server running on port ${port}`)
	}
})
