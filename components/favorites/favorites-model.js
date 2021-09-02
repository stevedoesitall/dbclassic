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

	}

	async removeFavorite(userId, tweetId) {
        
	}
}

export default Favorite