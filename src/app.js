import path from "path"
import express from "express"
import exphbs from "express-handlebars"
import cookieParser from "cookie-parser"

import getTweets from "./utils/create-lists.js"
import { tweetsRouter } from "../routes/tweets.js"
import { usersRouter } from "../routes/users.js"

//Let's look to consolidate these
import getDate from "./utils/get-date.js"
import getId from "./utils/get-id.js"
import { getUser, postUser } from "./utils/get-user.js"

import { formatDateStr, formatTime } from "./utils/format-date-time.js"

const app = express()

// Needed for POST/PUT requests; not currently functional
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())

const port = process.env.PORT || 8083
const __dirname = path.resolve() //Double check what path.resolve() does

const publicPath = path.join(__dirname, "./public")
const viewsPath = path.join(__dirname, "views")

app.engine(".html", exphbs({ extname: ".html" }))
app.set("view engine", ".html")

//NOTE: Set up partials path
app.set("views", viewsPath)

app.use(express.static(publicPath))

app.use("/tweets", tweetsRouter)
app.use("/users", usersRouter)

app.get("", async (req, res) => {
	const { allDates } = await getTweets()
	const userCookies = req.cookies
	let lastPageview

	if (userCookies.momus_id) {
		const data = await getUser(userCookies.momus_id)
		lastPageview = data.last_pageview ? data.last_pageview : null
	}

	res.cookie("momus_id", "110ec58a-a0f2-4ac4-8393-c866d813b8d1", {
		"sameSite": "strict",
		"httpOnly": true
	})

	res.render("index", {
		title: "Dadboner Classic",
		message: "Really lookin' forward to the weekend, you guys.",
		dates: allDates,
		lastPageview: lastPageview
	})
})

app.get("/tweet/:id", async (req, res) => {
	const tweetId = req.params.id
	const { data, prevTweet, nextTweet } = await getId(tweetId)
	const makeISO = true
	
	if (!data) {
		return res.render("error")
	}
	
	res.render("tweet", {
		data: data,
		formattedDateTime: `${formatDateStr(data.created_at, makeISO)} @ ${formatTime(data)}`,
		prev: prevTweet,
		next: nextTweet
	})
})

app.get("/date/:date", async (req, res) => {
	const date = req.params.date
	const { data, prevDate, nextDate } = await getDate(date)

	const userCookies = req.cookies

	if (userCookies.momus_id) {
		//Use this to manage user data and recs
		const update = await postUser(userCookies.momus_id, date)
		console.log(update)
	}

	if (!data) {
		return res.render("error")
	}

	const formattedDate = formatDateStr(date)

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

app.listen(port, (err) => {
	if (err) {
		console.log("Error starting server")
	} else {
		console.log(`Server running on port ${port}`)
	}
})
