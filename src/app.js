import path from "path"
import cron from "node-cron"
import express from "express"
import exphbs from "express-handlebars"
import cookieParser from "cookie-parser"
import session  from "express-session"
import { v4 as uuidv4 } from "uuid"

import router from "../routes/index.js"
import _ from "./utils/index.js"

const app = express()

// Needed for POST/PUT requests; not currently functional
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

const port = process.env.PORT || 8083
const __dirname = path.resolve() //Double check what path.resolve() does

const publicPath = path.join(__dirname, "./public")
const viewsPath = path.join(__dirname, "./public/views")

app.engine(".html", exphbs({ 
	extname: ".html", 	
	partialsDir: [
		"./public/views/partials/blocks",
		"./public/views/partials/ui"
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
	
	//Update this to a unique cookie for users, also need to add some login functionality

	if (!req.cookies.momus_id) {
		res.cookie("momus_id", "110ec58a-a0f2-4ac4-8393-c866d813b8d1", {
			"sameSite": "strict",
			"httpOnly": true
		})
	}

	if (req.session.views) {
		req.session.views++
	} else {
		req.session.views = 1
	}

	next()
})

app.get("", async (req, res) => {
	const { allDates } = await _.getTweets()
	
	let lastPageview

	const userCookies = req.cookies
	
	if (userCookies.momus_id) {
		const data = await _.getUser(userCookies.momus_id)
		lastPageview = data.last_pageview ? data.last_pageview : null
	}

	res.render("index", {
		title: "Dadboner Classic",
		message: "Really lookin' forward to the weekend, you guys.",
		dates: allDates,
		lastPageview: lastPageview
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
		//Use this to manage user data and recs
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

app.get("*", (req, res) => {
	res.render("error")
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
