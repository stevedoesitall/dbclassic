import knex from "../../config/database.js"
import Model from "../index/model.js"

class Favorite extends Model {
	constructor(tableName) {
		super(tableName)
	}

	async fetchByUserId(id) {
		let errMsg
		try {
			let userId = id

			const results = await knex.raw("SELECT t.id as tweet_id, t.text as text FROM tweets t JOIN users_tweets ut ON ut.tweet_id = t.id JOIN users u ON u.id = ut.user_id WHERE ut.user_id = ?", [ userId ], "ORDER BY t.created_at ASC")

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

	async fetchByTweetId(tweetId) {
		let errMsg
		try {
			const results = await knex.raw("SELECT t.id as tweet_id, t.text as text FROM tweets t JOIN users_tweets ut ON ut.tweet_id = t.id JOIN users u ON u.id = ut.user_id WHERE ut.tweet_id = ?", [ tweetId ], "ORDER BY t.created_at ASC")

			if (!results.rowCount) {
				errMsg = `No favorites found for tweet ${tweetId}.`
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
			console.log("fetchByTweetId completed on users_tweets table")
		}
	}

	async fetchByUserAndTweetIds(userId, tweetId) {
		let errMsg
		try {

			const results = await knex.raw("SELECT t.id as tweet_id, t.text as text FROM tweets t JOIN users_tweets ut ON ut.tweet_id = t.id JOIN users u ON u.id = ut.user_id WHERE ut.user_id = ? AND ut.tweet_id = ?", [ userId, tweetId ], "ORDER BY t.created_at ASC")

			if (!results.rowCount) {
				errMsg = `Tweet ${tweetId} is not a favorite of user ${userId}.`
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
			console.log("fetchByUserAndTweetIds completed on users_tweets table")
		}
	}

	async addFavorite(userId, tweetId) {
		let errMsg
		try {
			//Add validation for tweet and user IDs
			const values = {
				user_id: userId,
				tweet_id: tweetId
			}

			await knex(this.tableName).insert(values)

			return {
				ok: true
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

			//Add validation for tweet and user IDs

			await knex(this.tableName).where({"user_id": userId, "tweet_id": tweetId}).del()

			return {
				ok: true
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