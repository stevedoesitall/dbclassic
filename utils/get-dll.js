import DoublyLinkedList from "./create-dll.js"
import { formatDateISO } from "./format-date-time.js"

const getLinkedTweets = (allTweets, type, value) => {
	const tweetList = new DoublyLinkedList()
	let tweetValues = []

	allTweets.forEach(tweet => {
		if (type === "date") {
			tweetValues.push(formatDateISO(tweet.date))
		} else {
			tweetValues.push(tweet[type])
		}
	})

	tweetValues = [...new Set(tweetValues)]

	const linkedTweets = tweetList.createList(tweetValues)
	const prev = linkedTweets.get(value).prev ? linkedTweets.get(value).prev.val : null
	const next = linkedTweets.get(value).next ? linkedTweets.get(value).next.val : null

	return {
		prev,
		next
	}
}

export default getLinkedTweets