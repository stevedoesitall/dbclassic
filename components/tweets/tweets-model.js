import util from "util"
import dotenv from "dotenv"
import redis from "redis"
import knex from "../../config/database.js"
import { formatDateStr, formatTime } from "../../utils/format-date-time.js"
import getLinkedTweets from "../../utils/get-dll.js"
import Model from "../index/model.js"

dotenv.config()

const client = redis.createClient(process.env.REDIS_URL)
const THIRTY_MINUTES = 1800

client.get = util.promisify(client.get)

class Tweet extends Model {
	constructor(tableName) {
		super(tableName)
	}

	async fetchById(id, postCheck = false) {
		let errMsg

		try {
			const cachedTweet = await client.get(id)
			let result

			if (cachedTweet) {
				result = await JSON.parse(cachedTweet)
			} else {
				const results = await knex(this.tableName).where("id", id)
				result = results[0]
			}

			if (!result) {
				errMsg = `Tweet ${id} does not exist on the tweets table.`
				throw new Error(errMsg)
			}

			if (!postCheck) {
				client.setex(id, THIRTY_MINUTES, JSON.stringify(result))
				const cachedTweets = await client.get("tweetList")
				let allTweets
	
				if (cachedTweets) {
					allTweets = await JSON.parse(cachedTweets)
				} else {
					const response = await this.fetchAll()
					allTweets = response.results
					client.setex("tweetList", THIRTY_MINUTES, JSON.stringify(allTweets))
				}
	
				const linkedTweets = getLinkedTweets(allTweets, "id", id)
	
				result.text = result.text.replaceAll("&amp;", "&")
				result.date = formatDateStr(result.created_at)
				result.time = formatTime(result.created_at)
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

			const results = await knex.raw("SELECT id, text, created_at AT TIME ZONE 'GMT-05:00 DST' AS date FROM tweets ORDER BY created_at ASC;")

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

	async fetchByDate(date) {
		let errMsg

		try {
			const formattedDate = formatDateStr(date)
			const results = await knex(this.tableName).whereRaw("TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') = ?", [ date ]).orderBy("created_at", "asc")

			if (!results.length) {
				errMsg = `No tweet found from this date: ${date}. Kinda concering?`
				throw new Error(errMsg)
			}

			const cachedTweetsAll = await client.get("tweetList")
			let allTweets

			if (cachedTweetsAll) {
				allTweets = await JSON.parse(cachedTweetsAll)
			} else {
				const response = await this.fetchAll()

				if (!response.ok) {
					throw new Error("Error fetching all.")
				}

				allTweets = response.results
				client.setex("tweetList", THIRTY_MINUTES, JSON.stringify(allTweets))
			}
			
			const linkedDates = getLinkedTweets(allTweets, "date", date)

			results.map((row) => {
				row.text = row.text.replaceAll("&amp;", "&")
				row.time = formatTime(row.created_at)
			})

			return {
				ok: true,
				results: {
					rows: results,
					prevDate: linkedDates.prev,
					nextDate: linkedDates.next,
					formattedDate
				}
			}
		} catch (err) {
			console.log(err)
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log("fetchByDate completed on tweets table")
		}
	}

	async fetchDates() {
		let errMsg

		try {
			const results = {}

			const allDates = await knex.raw("SELECT DISTINCT TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') as date from tweets ORDER BY date ASC;",)
			results.allDates = allDates.rows

			if (!results.allDates.length) {
				errMsg = "Error retrieving all dates."
				throw new Error(errMsg)
			}

			const yearHeaders = await knex.raw("SELECT DISTINCT ON (year) date, year FROM (SELECT TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') as date, SUBSTRING(TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD'), 1, 4) as year FROM tweets ORDER BY date) AS a ORDER BY year;")
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
		let errMsg

		try {
			const textLower = "%" + text.toLowerCase() + "%"
			const results = await knex(this.tableName).where("text", "ILIKE", textLower).orderBy("created_at", "asc")

			if (!results.length) {
				errMsg = "No tweets found."
				throw new Error(errMsg)
			}

			results.map((row) => {
				row.text = row.text.replaceAll("&amp;", "&")
			})

			return {
				ok: true,
				results: results
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

			const values = {
				id,
				text: escapedText,
				created_at: createdAt
			}

			await knex(this.tableName).insert(values)

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

			const values = []

			for (let tweet of tweets) {
				const { id, text, created_at: createdAt } = tweet
				const result = await this.fetchById(id, true)
		
				if (result.error && id && text && createdAt) {
					values.push(tweet)
				}
			}

			if (!values.length) {
				errMsg = "All tweets were duplicate."
				throw new Error(errMsg)
			}

			const insert = await knex(this.tableName).insert(values)

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
