import fetch from "node-fetch"
import dotenv from "dotenv"
import getTweets from "./create-lists.js"
import { formatTime } from "./format-date-time.js"

dotenv.config()

const getDate = async (date) => {
	const { dateList } = await getTweets()
	const tweetRes = await fetch(`${process.env.BASE_URL}/tweets/date/${date}`)
	const data = await tweetRes.json()

	if (!data.length) {
		return true
	}

	data.map(tweet => {
		tweet.formattedTime = formatTime(tweet)
	})

	const prevDate = dateList.get(date).prev ? dateList.get(date).prev.val : null
	const nextDate = dateList.get(date).next ? dateList.get(date).next.val : null

	return { data, prevDate, nextDate }
}

export default getDate