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

app.use("/tweets", router.tweets)
app.use("/users", router.users)

app.get("*", async (req, res, next) => {
	if (req.session.views) {
		req.session.views++
	} else {
		req.session.views = 1
	}

	next()
})

//NOTE: Update this to login/logut endpoints
app.get("", async (req, res) => {
	const { allDates, yearHeaders } = await _.getTweets()
	const userCookies = req.cookies

	let lastPageview
	let loggedIn

	if (userCookies.momus_id) {
		const data = await _.getUser(userCookies.momus_id)
		loggedIn = data.logged_in ? true : false
		lastPageview = data.last_pageview && loggedIn ? data.last_pageview : false

		if (!loggedIn) {
			res.clearCookie("momus_id")
		}

		req.session.loginId = userCookies.momus_id
	}

	res.render("index", {
		title: "Momus.io",
		message: "Really lookin' forward to the weekend, you guys.",
		dates: allDates,
		lastPageview: lastPageview,
		loggedIn: loggedIn,
		userId: userCookies.momus_id,
		yearHeaders: yearHeaders
	})
})

app.get("/tweet/:id", async (req, res) => {
	const tweetId = req.params.id
	const { data, prevTweet, nextTweet } = await _.getTweetById(tweetId)
	const makeISO = true
	
	if (!data) {
		return res.render("error")
	}
	
	res.render("tweet", {
		data: data,
		formattedDateTime: `${_.formatDateStr(data.created_at, makeISO)} @ ${_.formatTime(data)}`,
		prev: prevTweet,
		next: nextTweet
	})
})

app.get("/date/:date", async (req, res) => {
	const date = req.params.date
	const { data, prevDate, nextDate } = await _.getTweetByDate(date)

	const userCookies = req.cookies

	if (userCookies.momus_id) {
		try {
			await _.updateUser(userCookies.momus_id, date)
		} catch (err) {
			console.log(err)
		} finally {
			console.log("Cookie setting finished")
		}
	}

	if (!data) {
		return res.render("error")
	}

	const formattedDate = _.formatDateStr(date)

	res.render("date", {
		tweets: data,
		prev: prevDate,
		next: nextDate,
		date: date,
		formattedDate: formattedDate
	})
})

app.get("/search", (req, res) => {
	res.render("search")
})

app.get("/login", (req, res) => {
	res.render("login")
})

app.get("/account/:id", async (req, res) => {
	if (req.params.id !== req.session.loginId) {
		return res.render("error", {
			errMsg: "You don't have permission to access this page."
		})
	}

	const data = await _.getUser(req.session.loginId)

	res.render("account", {
		userName: data.user_name
	})
})

app.get("*", (req, res) => {
	res.render("error", {
		errMsg: "Page doesn't exist. Kinda concerning?"
	})
})

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
