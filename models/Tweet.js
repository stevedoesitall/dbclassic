
import Model from "./Model.js"
import pool from "../config/database.js"
import { filterArray, buildQuery } from "./utils/validate-array.js"

const modelTable = "tweets"

class Tweet extends Model {
    #table

    constructor(table) {
        super(table = modelTable)
        this.#table = modelTable
    }

    async fetchByDate(date) {
        const errMsg = `No tweet found from this date: ${date}. Kinda concering?`

        try {
            const results = await pool.query(`SELECT * FROM ${this.#table} WHERE to_char(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') = '${date}' ORDER BY created_at asc;`)

            if (!results.rows.length) {
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
            console.log(`fetchByDate completed on ${this.#table} table`)
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
    
            const filteredTweets = await filterArray(tweets)

            if (!filteredTweets.length) {
                errMsg = "All tweets were duplicate."
                throw new Error(errMsg)
            }

            const values = await buildQuery(filteredTweets)

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