import util from "util"
import dotenv from "dotenv"
import redis from "redis"
import pool from "../config/database.js"
import _ from "./utils/index.js"

dotenv.config()

const modelTable = "tweets"
const client = redis.createClient(process.env.REDIS_URL)
const THIRTY_MINUTES = 1800

client.get = util.promisify(client.get)

class Tweet {

	constructor() {
	
	}

	async fetchById(id, postCheck = false) {
		let errMsg

		try {
			const cachedTweet = await client.get(id)
			let result

			if (cachedTweet) {
				result = await JSON.parse(cachedTweet)
			} else {
				const query = {
					text: "SELECT * FROM tweets WHERE id = $1",
					values: [ id ]
				}

				const results = await pool.query(query)
				result = results.rows[0]

				if (!postCheck) {
					client.setex(id, THIRTY_MINUTES, JSON.stringify(result))
				}
			}

			if (!result) {
				errMsg = `Tweet ${id} does not exist on the tweets table.`
				throw new Error(errMsg)
			}

			if (!postCheck) {
				const cachedTweets = await client.get("tweetList")
				let allTweets
	
				if (cachedTweets) {
					allTweets = await JSON.parse(cachedTweets)
				} else {
					const response = await this.fetchAll()
					allTweets = response.results
					client.setex("tweetList", THIRTY_MINUTES, JSON.stringify(allTweets))
				}
	
				const linkedTweets = _.getLinkedTweets(allTweets, "id", id)
	
				result.text = result.text.replaceAll("&amp;", "&")
				result.date = _.formatDateStr(result.created_at)
				result.time = _.formatTime(result.created_at)
				result.prevTweet = linkedTweets.prev
				result.nextTweet = linkedTweets.next	
			}

			return {
				ok: true,
				result
			}

		} catch (err) {
			console.log(err)
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log("fetchById completed on tweets table")
		}
	}

	async fetchAll() {
		try {
			const query = {
				text: "SELECT id, text, created_at AT TIME ZONE 'GMT-05:00 DST' AS date FROM tweets ORDER BY created_at ASC;",
				values: null
			}

			const results = await pool.query(query)

			if (!results.rows.length) {
				throw new Error("No results found.")
			}

			return {
				ok: true,
				results: results.rows
			}

		} catch (err) {
			console.log(err)
			return {
				ok: false,
				error: err
			}
		} finally {
			console.log("fetchAll completed on tweets table")
		}
	}

	//Change to query param
	async fetchByDate(date) {
		try {
			//Cache with Redis
			const formattedDate = _.formatDateStr(date)
			// const cachedTweetsByDate = await client.get(formattedDate)
			// let results

			const query = {
				text: "SELECT * FROM tweets WHERE to_char(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') = $1 ORDER BY created_at ASC;",
				values: [ date ]
			}

			const results = await pool.query(query)

			if (!results.rows.length) {
				throw new Error(`No tweet found from this date: ${date}. Kinda concering?`)
			}

			const cachedTweetsAll = await client.get("tweetList")
			let allTweets

			if (cachedTweetsAll) {
				console.log("GETTING FROM REDIS")
				allTweets = await JSON.parse(cachedTweetsAll)
			} else {
				console.log("GETTING FROM PG")
				const response = await this.fetchAll()

				if (!response.ok) {
					throw new Error("Error fetching all.")
				}

				allTweets = response.results
				client.setex("tweetList", THIRTY_MINUTES, JSON.stringify(allTweets))
			}

			const linkedDates = _.getLinkedTweets(allTweets, "date", date)

			results.formattedDate = formattedDate
			results.prevDate = linkedDates.prev
			results.nextDate = linkedDates.next

			results.rows.map((row) => {
				row.text = row.text.replaceAll("&amp;", "&")
				row.time = _.formatTime(row.created_at)
			})

			return {
				ok: true,
				results: {
					rows: results.rows,
					prevDate: results.prevDate,
					nextDate: results.nextDate,
					formattedDate: results.formattedDate
				}
			}
		} catch (err) {
			return {
				ok: false,
				error: err
			}
		} finally {
			console.log("fetchByDate completed on tweets table")
		}
	}

	async fetchDates() {
		let errMsg

		try {
			const results = {}
			const queries = {
				allDates: {
					text: "SELECT DISTINCT TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') as date from tweets ORDER BY date ASC;",
					values: null
				},

				yearHeaders: {
					text: "SELECT DISTINCT ON (year) date, year FROM (SELECT TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') as date, SUBSTRING(TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD'), 1, 4) as year FROM tweets ORDER BY date) AS a ORDER BY year;",
					values: null
				}
			}

			const allDates = await pool.query(queries.allDates)
			results.allDates = allDates.rows

			if (!results.allDates.length) {
				errMsg = "Error retrieving all dates."
				throw new Error(errMsg)
			}

			const yearHeaders = await pool.query(queries.yearHeaders)
			results.yearHeaders = yearHeaders.rows

			if (!results.yearHeaders.length) {
				errMsg = "Error retrieving year headers."
				throw new Error(errMsg)
			}

			return {
				ok: true,
				results
			}
		} catch (err) {
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log("fetchDates completed on tweets table")
		}
	}

	async fetchByText(text) {
		const textLower = text.toLowerCase()
		let errMsg

		try {
			const query = {
				text: "SELECT * FROM tweets WHERE text ILIKE $1 ORDER BY created_at ASC;",
				values: [ `%${textLower}%` ]
			}

			const results = await pool.query(query)

			if (!results.rows.length) {
				errMsg = "No tweets found."
				throw new Error(errMsg)
			}

			results.rows.map((row) => {
				row.text = row.text.replaceAll("&amp;", "&")
			})

			return {
				ok: true,
				results: results.rows
			}
		} catch (err) {
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log("fetchByText completed on tweets table")
		}
	}

	async insertOne(id, text, createdAt) {
		let errMsg

		try {
			if (!id || !text || !createdAt) {
				errMsg = "Invalid parameters."
				throw new Error(errMsg)
			}

			const escapedText = text.replaceAll("'", "''")
			const result = await this.fetchById(id, true)
			
			if (!result.error) {
				errMsg = `Tweet ID ${id} already exists.`
				throw new Error(errMsg)
			}

			const query = {
				text: "INSERT INTO tweets (id, text, created_at) VALUES($1, $2, $3);",
				values: [ id, escapedText, createdAt ]
			}

			await pool.query(query)

			return {
				ok: true
			}
		} catch (err) {
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log("insertOne completed on tweets table")
		}
	}

	async insertMany(tweets) {
		let errMsg

		try {
			if (!tweets || !tweets.length) {
				errMsg = "No tweets."
				throw new Error(errMsg)
			}

			const filteredTweets = await _.filterTweetsArray(tweets)

			if (!filteredTweets.length) {
				errMsg = "All tweets were duplicate."
				throw new Error(errMsg)
			}

			let values = []

			filteredTweets.forEach(tweet => {
				values = [...values, ...Object.values(tweet)]
			})

			let text = "INSERT INTO tweets (id, text, created_at) VALUES"
			let valuesText = ""
			let startNum = 1
			let total = 0

			while (total < filteredTweets.length) {
				valuesText = valuesText + `($${startNum},$${startNum + 1},$${startNum + 2}),`
				total++
				startNum = startNum + 3
			}

			text = `${text}${valuesText.slice(0, -1)};`
			
			const query = {
				text: text,
				values: values
			}

			const insert = await pool.query(query)

			return {
				ok: true,
				rowCount: insert.rowCount
			}
		} catch (err) {
			console.log(err)
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log("insertMany completed on tweets table")
		}
	}
}

export default Tweet
