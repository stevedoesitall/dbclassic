import path from "path"
import express from "express"
import exphbs from "express-handlebars"

import getTweets from "./utils/create-lists.js"
import { tweetsRouter } from "../routes/tweets.js"

import getDate from "./utils/get-date.js"
import getId from "./utils/get-id.js"

const app = express()

// Needed for POST/PUT requests; not currently functional
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

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

app.get("", async (req, res) => {
	const { allDates } = await getTweets()
	console.log("GETTING DATES")
	res.render("index", {
		title: "Dadboner Classic",
		message: "Really lookin' forward to the weekend, you guys.",
		dates: allDates
	})
})

app.get("/tweet/:id", async (req, res) => {
	const tweetId = req.params.id
	const { data, prevTweet, nextTweet } = await getId(tweetId)

	if (!data) {
		return res.render("error")
	}

	res.render("tweet", {
		message: data.text,
		prev: prevTweet,
		next: nextTweet
	})
})

app.get("/date/:date", async (req, res) => {
	const date = req.params.date
	const { data, prevDate, nextDate } = await getDate(date)

	const dateTime = new Date(date).getTime()
	const formattedDate = new Date(dateTime).toDateString()

	if (!data) {
		return res.render("error")
	}

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
