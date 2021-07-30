import fetch from "node-fetch"
import dotenv from "dotenv"
import { dateList } from "./create-lists.js"

dotenv.config()

const getDate = async (date) => {
	const tweetRes = await fetch(`${process.env.BASE_URL}/tweets/date/${date}`)
	const data = await tweetRes.json()

	if (!data.length) {
		return true
	}

	data.map(tweet => {
		const tweetDate = new Date(tweet.created_at)
		tweet.hour = tweetDate.getHours() - 4
		tweet.marker = tweetDate.getHours() > 12 ? "PM" : "AM"
    
		if (tweet.hour > 12) {
			tweet.hour = tweet.hour - 12
		} else if (tweet.hour === 0) {
			tweet.hour = 12
		}
    
		tweet.minute = tweetDate.getMinutes() < 10 ? "0" + tweetDate.getMinutes() : tweetDate.getMinutes(),
		tweet.seconds = tweetDate.getSeconds() < 10 ? "0" + tweetDate.getSeconds() : tweetDate.getSeconds(),
		tweet.formattedTime = `${tweet.hour}:${tweet.minute}:${tweet.seconds} ${tweet.marker}`
	})

	const prevDate = dateList.get(date).prev ? dateList.get(date).prev.val : null
	const nextDate = dateList.get(date).next ? dateList.get(date).next.val : null

	return { data, prevDate, nextDate }
}

export default getDate