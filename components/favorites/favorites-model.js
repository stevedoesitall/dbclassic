import dotenv from "dotenv"
import pool from "../../config/database.js"

class Favorite {
	constructor() {

	}

	async fetchByUserId(userId) {
		let errMsg
		try {
			const query = {
				text: "SELECT t.id as tweet_id, t.text as text FROM tweets t JOIN users_tweets ut ON ut.tweet_id = t.id JOIN users u ON u.id = ut.user_id WHERE ut.user_id = $1;",
				values: [ userId ]
			}

			const results = await pool.query(query)

			if (!results.rowCount) {
				errMsg = `No favorites found for user ${userId}.`
				throw new Error(errMsg)
			}
    
			return {
				ok: true,
				results: results.rows
			}
		} catch (err) {
			console.log(err)
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log("fetchByUserId completed on users_tweets table")
		}

	}

	async addFavorite(userId, tweetId) {
		let errMsg
		try {
			const query = {
				text: "INSERT INTO users_tweets (user_id, tweet_id) VALUES($1, $2);",
				values: [ userId, tweetId ]
			}

			const results = await pool.query(query)

			return {
				ok: true,
				results: results
			}
		} catch (err) {
			console.log(err)
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log("addFavorite completed on the users_tweets table")
		}
	}

	async removeFavorite(userId, tweetId) {
		let errMsg
		try {
			const query = {
				text: "DELETE FROM users_tweets WHERE user_id = $1 AND tweet_id = $2;",
				values: [ userId, tweetId ]
			}

			const results = await pool.query(query)

			return {
				ok: true,
				results: results
			}
		} catch (err) {
			console.log(err)
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log("removeFavorite completed on the users_tweets table")
		}
	}
}

export default Favorite