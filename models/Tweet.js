import util from "util"
import dotenv from "dotenv"
import redis from "redis"
import Model from "./Model.js"
import pool from "../config/database.js"
import _ from "./utils/index.js"

dotenv.config()

const modelTable = "tweets"
const client = redis.createClient(process.env.REDIS_URL)
const THIRTY_MINUTES = 1800

client.get = util.promisify(client.get)

class Tweet extends Model {
	#table

	constructor(table) {
		super((table = modelTable))
		this.#table = modelTable
	}

	async fetchById(id) {
		let errMsg

		try {
			const results = await pool.query(
				`SELECT * FROM ${this.#table} WHERE id = '${id}';`
			)
			const result = results.rows[0]

			if (!result) {
				errMsg = `Tweet ${id} does not exist.`
				throw new Error(errMsg)
			}

			const tweetId = id.toString()
			const cachedTweets = await client.get("tweetList")
			let allTweets

			if (cachedTweets) {
				console.log("GETTING FROM REDIS")
				allTweets = await JSON.parse(cachedTweets)
			} else {
				const response = await this.fetchAll()
				allTweets = response.results
				console.log("GETTING FROM PG")
				client.setex("tweetList", THIRTY_MINUTES, JSON.stringify(allTweets))
			}

			const linkedTweets = _.getLinkedTweets(allTweets, "id", id)

			result.text = result.text.replaceAll("&amp;", "&")
			result.date = _.formatDateStr(result.created_at)
			result.time = _.formatTime(result.created_at)
			result.prevTweet = linkedTweets.prev
			result.nextTweet = linkedTweets.next

			return {
				ok: true,
				result
			}

		} catch (err) {
			return {
				error: errMsg
			}
		} finally {
			console.log(`fetchById completed on ${this.#table} table`)
		}
	}

	async fetchAll() {
		let errMsg

		try {
			const results = await pool.query(`SELECT id, text, created_at AT TIME ZONE 'GMT-05:00 DST' AS date FROM ${
				this.#table
			} ORDER BY created_at ASC;`)

			if (!results.rows.length) {
				errMsg = "No results found."
				throw new Error(errMsg)
			}

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
			console.log(`fetchAll completed on ${this.#table} table`)
		}
	}

	async fetchByDate(date) {
		let errMsg

		try {
			//Cache with Redis
			const formattedDate = _.formatDateStr(date)
			// const cachedTweetsByDate = await client.get(formattedDate)
			// let results

			const results = await pool.query(
				`SELECT * FROM ${this.#table} WHERE to_char(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') = '${date}' ORDER BY created_at ASC;`
			)

			if (!results.rows.length) {
				errMsg = `No tweet found from this date: ${date}. Kinda concering?`
				throw new Error(errMsg)
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
					errMsg = "Error fetching all."
					throw new Error(errMsg)
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
				error: errMsg
			}
		} finally {
			console.log(`fetchByDate completed on ${this.#table} table`)
		}
	}

	async fetchDates() {
		let errMsg

		try {
			const results = {}
			const queries = {
				allDates:
					"SELECT DISTINCT TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') as date from tweets ORDER BY date ASC;",

				yearHeaders:
					"SELECT DISTINCT ON (year) date, year FROM (SELECT TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') as date, SUBSTRING(TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD'), 1, 4) as year FROM tweets ORDER BY date) AS a ORDER BY year;"
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
			console.log(`fetchDates completed on ${this.#table} table`)
		}
	}

	async fetchByText(text) {
		const textLower = text.toLowerCase()
		let errMsg

		try {
			const results = await pool.query(
				`SELECT * FROM ${this.#table} WHERE text ILIKE '%${textLower}%' ORDER BY created_at ASC;`
			)

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
			console.log(`fetchByText completed on ${this.#table} table`)
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
			const result = await this.fetchById(id)

			if (!result.error) {
				errMsg = `Tweet ID ${id} already exists.`
				throw new Error(errMsg)
			}

			await pool.query(`
                INSERT INTO ${this.#table} (id, text, created_at)
                VALUES ('${id}', '${escapedText}','${createdAt}');
            `)

			return {
				ok: true
			}
		} catch (err) {
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log(`insertOne completed on ${this.#table} table`)
		}
	}

	async insertMany(tweets) {
		let errMsg

		try {
			if (!tweets || !tweets.length) {
				errMsg = "No tweets."
				throw new Error(errMsg)
			}

			const filteredTweets = await _.insertManyTweetsQB(tweets)

			if (!filteredTweets.length) {
				errMsg = "All tweets were duplicate."
				throw new Error(errMsg)
			}

			const values = await _.insertManyTweets(filteredTweets)

			const insert = await pool.query(`
                INSERT INTO ${this.#table} (id, text, created_at)
                VALUES ${values};
            `)

			return {
				ok: true,
				rowCount: insert.rowCount
			}
		} catch (err) {
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log(`insertMany completed on ${this.#table} table`)
		}
	}
}

export default Tweet
