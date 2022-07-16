import { formatDateISO } from "./format-date-time.js"

const getLinkedTweets = (allTweets, type, value) => {
	const tweetValues = []

	allTweets.forEach(tweet => {
		const tweetValue = type === "date" ? formatDateISO(tweet.date) : tweet[type]
		!tweetValues.includes(tweetValue) ? tweetValues.push(tweetValue) : null
	})

	const tweetValuesSorted = tweetValues.sort((a, b) => a.id - b.id)

	const index = tweetValuesSorted.indexOf(value)
	const prev = index > 0 ? tweetValuesSorted[index - 1] : null
	const next = index < tweetValuesSorted.length - 1 ? tweetValuesSorted[index + 1] : null

	return {
		prev,
		next
	}
}

export default getLinkedTweets