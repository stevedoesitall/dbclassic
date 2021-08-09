import Tweet from "../../../models/Tweet.js"
import getTweets from "../helpers/create-lists.js"
import { formatTime } from "../helpers/format-date-time.js"

const getTweetById = async (tweetId) => {

	const { tweetList } = await getTweets()
	const data = await new Tweet().fetchOne(tweetId)

	if (data.error) {
		return true
	}
    
	const prevTweet = tweetList.get(tweetId).prev ? tweetList.get(tweetId).prev.val : null
	const nextTweet = tweetList.get(tweetId).next ? tweetList.get(tweetId).next.val : null

	return { data, prevTweet, nextTweet }
}

const getTweetByDate = async (date) => {
	const { dateList } = await getTweets()
	const data = await new Tweet().fetchByDate(date)

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


export { getTweetById, getTweetByDate }