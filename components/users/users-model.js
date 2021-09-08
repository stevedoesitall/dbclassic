import knex from "../../config/database.js"
import Model from "../index/model.js"

class User extends Model {
	constructor(tableName = "users") {
		super(tableName)
	}

	async fetchAll() {
		try {
			const results = await knex(this.tableName).orderBy("created_at", "ASC")

			if (!results.length) {
				throw new Error("No results found.")
			}

			return {
				ok: true,
				results: results
			}
		} catch (err) {
			console.log(err)

			return {
				ok: false,
				error: err
			}
		} finally {
			console.log("fetchAll completed on users table")
		}
	}

	async fetchById(id) {
		try {

			const results = await knex(this.tableName).where("id", id)
			const result = results[0]

			if (!result) {
				throw new Error(`ID ${id} does not exist on users table.`)
			}

			return {
				ok: true,
				result
			}
		} catch (err) {
			console.log(err)
			
			return {
				ok: false,
				error: err
			}
		} finally {
			console.log("fetchById completed on users table")
		}
	}

	async fetchBySession(session) {
		try {

			const results = await knex(this.tableName).where("latest_session_id", session)
			const result = results[0]

			if (!result) {
				throw new Error(`Session ${session} does not exist on users table.`)
			}

			return {
				ok: true,
				result
			}
		} catch (err) {
			console.log(err)
			
			return {
				ok: false,
				error: err
			}
		} finally {
			console.log("fetchBySession completed on users table")
		}
	}

	async fetchByName(name, password) {
		let errMsg
		try {
			const results = await knex(this.tableName).where("user_name", name)
			const result = results[0]

			if (!result) {
				errMsg = `User Name ${name} does not exist on users table.`
				throw new Error(errMsg)
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
			console.log("fetchOne completed on users table")
		}
	}

	async insertOne(id, values) {
		let errMsg
		try {
			const { user_name, password } = values
			if (!id || !user_name || !password) {
				errMsg = "Missing all required parameters."
				throw new Error(errMsg)
			}

			const result = await this.fetchById(id)

			if (!result.error) {
				errMsg = `User ID ${id} already exists.`
				throw new Error(errMsg)
			}

			values.id = id
			values.created_at = new Date().toISOString()

			await knex(this.tableName).insert(values)
			
			return {
				ok: true
			}
		} catch (err) {
			console.log(errMsg)
			
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log("insertOne completed on users table")
		}
	}

	async updateOne(id, updates) {
		let errMsg

		try {

			if (!updates || !Object.keys(updates).length) {
				errMsg = "No updates provided."
				throw new Error(errMsg)
			}

			const result = await this.fetchById(id)

			if (result.error) {
				errMsg = `User ID ${id} does not exist.`
				throw new Error(errMsg)
			}

			const allowedUpdates = [ "last_pageview", "password", "user_name", "latest_session_id" ]

			for (let update in updates) {
				if (!allowedUpdates.includes(update)) {
					delete updates[update]
				}
			}

			if (!Object.keys(updates).length) {
				errMsg = "Invalid update parameters provided."
				throw new Error(errMsg)
			}

			updates.last_update_date = new Date().toISOString()

			await knex(this.tableName).update(updates).where("id", id)

			return {
				ok: true,
				response: {
					userId: id,
					updates: Object.keys(updates)
				}
			}
		} catch (err) {
			console.log(err)
			
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log("updateOne completed on users table")
		}
	}
}

export default User
