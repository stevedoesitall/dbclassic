import Tweet from "../../../models/Tweet.js"
import { formatDateISO } from "./format-date-time.js"

class Node {
	constructor(val) {
		this.val = val
		this.prev = null
		this.next = null
	}
}

class DoublyLinkedList {
	constructor() {
		this.head = null
		this.tail = null
		this.length = 0
	}

	push(val) {
		const newNode = new Node(val)
		if (!this.head) {
			this.head = newNode
			this.tail = this.head
		} else {
			this.tail.next = newNode
			newNode.prev = this.tail
			this.tail = newNode
		}

		this.length++

		return this
	}

	get(value) {
		const listSize = this.length
		let counter = 0
		let myNode
		let currentNode = this.head

		while (!myNode) {
			if (currentNode.val !== value) {
				if (counter === listSize) {
					return false
				}
				currentNode = currentNode.next
				counter++
			} else {
				myNode = currentNode
			}
		}

		return myNode
	}
}

const getTweets = async () => {

	const allDates = []
	const tweetList = new DoublyLinkedList()
	const dateList = new DoublyLinkedList()

	const results = await new Tweet().fetchAll()

	results.forEach(tweet => {
		const tweetDate = formatDateISO(tweet.date)

		if (!allDates.includes(tweetDate)) {
			allDates.push(tweetDate)
			dateList.push(tweetDate)
		}

		tweetList.push(tweet.id)
	})

	const uniqueYears = [...new Set(allDates.map(date => date.substring(0, 4)))]
	const yearHeaders = []

	uniqueYears.forEach(year => {
		const firstDay = allDates.find(day => day.substring(0, 4) === year)
		yearHeaders.push({
			year,
			firstDay
		})
	})

	return { allDates, tweetList, dateList, yearHeaders }

}

export default getTweets