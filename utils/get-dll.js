import { formatDateISO } from "./format-date-time.js"

const getLinkedTweets = (allTweets, type, value) => {
	const tweetValues = []

	allTweets.forEach(tweet => {
		const tweetValue = type === "date" ? formatDateISO(tweet.created_at) : tweet[type]
		!tweetValues.includes(tweetValue) ? tweetValues.push(tweetValue) : null
	})

	const index = tweetValues.indexOf(value)
	const prev = index > 0 ? tweetValues[index - 1] : null
	const next = index < tweetValues.length - 1 ? tweetValues[index + 1] : null

	return {
		prev,
		next
	}
}

export default getLinkedTweets