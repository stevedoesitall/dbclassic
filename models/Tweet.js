
import Model from "./Model.js"
import DoublyLinkedList from "./DoublyLinkedList.js"
import pool from "../config/database.js"
import _ from "./utils/index.js"

const modelTable = "tweets"

//NOTE: Move storage of DLLs over to Redis once implemented

class Tweet extends Model {
    #table

    constructor(table) {
        super(table = modelTable)
        this.#table = modelTable
    }

    async fetchById(id) {
        let errMsg

        try {
            const results = await pool.query(`SELECT * FROM ${this.#table} WHERE id = '${id}';`)
            const result = results.rows[0]

            if (!result) {
                errMsg = `Tweet ${id} does not exist.`
                throw new Error(errMsg)
            }

            const tweetId = id.toString()
            const allTweets = await this.fetchAll()
            const tweetList = new DoublyLinkedList()
            const tweetIds = []
            
            allTweets.forEach(tweet => {
                tweetIds.push(tweet.id)
            })
    
            const linkedTweets = tweetList.createList(tweetIds)
            const prevTweet = linkedTweets.get(tweetId).prev ? linkedTweets.get(tweetId).prev.val : null
            const nextTweet = linkedTweets.get(tweetId).next ? linkedTweets.get(tweetId).next.val : null    

            result.text = result.text.replaceAll("&amp;", "&")
            result.date = _.formatDateStr(result.created_at)
            result.time = _.formatTime(result.created_at)
            result.prevTweet = prevTweet ? prevTweet : null
            result.nextTweet = nextTweet ? nextTweet : null

            return {
                ok: true,
                result
            }

        } catch(err) {
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
            const query = `SELECT id, text, created_at AT TIME ZONE 'GMT-05:00 DST' AS date FROM ${this.#table} ORDER BY created_at ASC;`

            const results = await pool.query(query)

            if (!results.rows.length) {
                errMsg = "No results found."
                throw new Error(errMsg)
            }

            return results.rows

        } catch(err) {
            console.log(err)

        } finally {
            console.log(`fetchAll completed on ${this.#table} table`)
        }
    }

    async fetchByDate(date) {
        let errMsg

        try {
            const results = await pool.query(`SELECT * FROM ${this.#table} WHERE to_char(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') = '${date}' ORDER BY created_at ASC;`)

            if (!results.rows.length) {
                errMsg = `No tweet found from this date: ${date}. Kinda concering?`
                throw new Error(errMsg)
            }

            const allTweets = await this.fetchAll()
            const tweetList = new DoublyLinkedList()
            const tweetDates = []

            allTweets.forEach(tweet => {
                const tweetDate = _.formatDateISO(tweet.date)
                if (!tweetDates.includes(tweetDate)) {
                    tweetDates.push(tweetDate)
                }
            })

            const linkedDates = tweetList.createList(tweetDates)
            const prevDate = linkedDates.get(date).prev ? linkedDates.get(date).prev.val : null
            const nextDate = linkedDates.get(date).next ? linkedDates.get(date).next.val : null    

            results.formattedDate = _.formatDateStr(date)
            results.prevDate = prevDate
            results.nextDate = nextDate

            results.rows.map(row => {
                row.text = row.text.replaceAll("&amp;", "&")
                row.time = _.formatTime(row.created_at)
            })
    
            return results

        } catch(err) {
            return {
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
                allDates: "SELECT DISTINCT TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') as date from tweets ORDER BY date ASC;",

                yearHeaders: "SELECT DISTINCT ON (year) date, year FROM (SELECT TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') as date, SUBSTRING(TO_CHAR(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD'), 1, 4) as year FROM tweets ORDER BY date) AS a ORDER BY year;"
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

            return results

        } catch(err) {
            return {
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
            const results = await pool.query(`SELECT * FROM ${this.#table} WHERE text ILIKE '%${textLower}%' ORDER BY created_at ASC;`)
            
            if (!results.rows.length) {
                errMsg = "No tweets found."
                throw new Error(errMsg)
            }
    
            results.rows.map(row => {
                row.text = row.text.replaceAll("&amp;", "&")
            })
    
            return results.rows

        } catch(err) {
            return {
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

        } catch(err) {
            return {
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

        } catch(err) {
            return {
                error: errMsg
            }
        } finally {
            console.log(`insertMany completed on ${this.#table} table`)
        }
    }
}

export default Tweet