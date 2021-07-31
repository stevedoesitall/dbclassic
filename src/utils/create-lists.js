import Knex from "knex"
import knexfile from "../../config/knexfile.js"
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
	const knex = Knex(knexfile.production)
	const allDates = []
	const tweetList = new DoublyLinkedList()
	const dateList = new DoublyLinkedList()

	try {
		const results = await knex.raw("SELECT id, text, created_at AT TIME ZONE 'GMT-05:00 DST' AS date FROM tweets ORDER BY created_at asc;")
		const tweets = results.rows

		tweets.forEach(tweet => {
			const tweetDate = formatDateISO(tweet.date)

			if (!allDates.includes(tweetDate)) {
				allDates.push(tweetDate)
				dateList.push(tweetDate)
			}

			tweetList.push(tweet.id)
		})

		return { allDates, tweetList, dateList }

	} catch (err) {
		console.log(err)

	} finally {
		knex.destroy(() => {
			console.log("Connection destroyed.")
		})
	}
}

export default getTweets