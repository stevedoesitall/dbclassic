import fetch from "node-fetch"
import dotenv from "dotenv"
import getTweets from "./create-lists.js"

dotenv.config()

const getId = async (tweetId) => {

	const { tweetList } = await getTweets()
	const tweetRes = await fetch(`${process.env.BASE_URL}/tweets/${tweetId}`)
	const data = await tweetRes.json()

	if (data.error) {
		return true
	}
    
	const prevTweet = tweetList.get(tweetId).prev ? tweetList.get(tweetId).prev.val : null
	const nextTweet = tweetList.get(tweetId).next ? tweetList.get(tweetId).next.val : null

	return { data, prevTweet, nextTweet }
}

export default getId