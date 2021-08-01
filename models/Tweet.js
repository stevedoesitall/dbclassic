import pkg from "pg"
import { prodCreds } from "../config/db-creds.js"

class Tweet {
	constructor(tweet) {
		this.text = tweet.text
		this.id = tweet.id
		this.created_at = tweet.created_at
	}

	async validateTweet() {
		const { Pool } = pkg
		const pool = new Pool(prodCreds)

		try {
			const results = await pool.query(`SELECT * FROM tweets WHERE id = '${this.id}'`)

			const tweetExists = {
				check: results.rows.length,
				msg: "Tweet exists"
			}

			const invalidId = {
				check: !this.id,
				msg: "Invalid ID"
			}
			
			const invalidLength = {
				check: !this.text.length || this.text.length > 280,
				msg: "Invalid tweet length"
			}

			const invalidDate = {
				check: isNaN(new Date(this.created_at).getTime()),
				msg: "Invalid date"
			}

			if (tweetExists.check) {
				throw new Error(tweetExists.msg)

			} else if (invalidId.check) {
				throw new Error(invalidId.msg)

			} else if (invalidLength.check) {
				throw new Error(invalidLength.msg)

			} else if (invalidDate.check) {
				throw new Error(invalidDate.msg)
			}

			return true

		} catch(err) {
			return err

		} finally {
			pool.end()
		}
	}
}

export default Tweet