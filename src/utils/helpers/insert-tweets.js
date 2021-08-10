import fetch from "node-fetch"
import nodemailer from "nodemailer"
import Tweet from "../../../models/Tweet.js"

const insertTweets = async () => {
	const USER_ID = "133110529"
	const MAX_RESULTS = 100
	const TWEET_FIELDS = "created_at"
	let message = ""

	const yesterday = new Date(Date.now() - 864e5)
	const year = yesterday.getFullYear()
    
	let month = yesterday.getMonth() + 1
	month = month < 10 ? "0" + month : month
    
	let day = yesterday.getDate()
	day = day < 10 ? "0" + day : day
    
	const date = `${year}-${month}-${day}`
    
	const startTime = `${date}T12:00:00Z`
	const endTime = `${date}T23:59:59Z`
    
	try {
		console.log("GETTING TWEETS")
		const response = await fetch(`https://api.twitter.com/2/users/${USER_ID}/tweets?max_results=${MAX_RESULTS}&start_time=${startTime}&end_time=${endTime}&tweet.fields=${TWEET_FIELDS}`, {
			"headers": {
				"Authorization": process.env.AUTHORIZATION
			}
		})
        
		const results = await response.json()

		const resultCount = results.meta.result_count

		if (!resultCount) {
			message = "No tweets found for this day"
			throw new Error(message)
		}

		const tweet = new Tweet()
		const { id, text, created_at: createdAt } = results.data

		const insert = await tweet.insertOne(id, text, createdAt)

		if (insert.error) {
			message = "Erroring inserting tweet"
			throw new Error(message)
		}

		message = `Saved ${resultCount} tweet${resultCount > 1 ? "s" : ""}`

		return message

	} catch (err) {
		return err

	} finally {
		const transporter = nodemailer.createTransport({
			host: "smtp.mail.yahoo.com",
			port: 465,
			secure: false,
			service: "yahoo",
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS
			},
			debug: false,
			logger: true
		})
        
		const mailOptions = {
			from: "plex.requester@yahoo.com",
			to: "steve@momus.io",
			subject: `DB Classic update for ${date}`,
			text: `${message}`
		}

		transporter.sendMail(mailOptions, (err, res) => {
			if (err) {
				console.log(err)
			} else {
				console.log(res)
			}
		})
	}
}

export default insertTweets