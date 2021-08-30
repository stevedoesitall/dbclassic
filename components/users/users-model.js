import pool from "../../config/database.js"
import { updateOneUserQB } from "../../utils/query-helpers.js"

class User {

	constructor() {

	}

	async fetchAll() {
		try {
			const query = {
				text: "SELECT * FROM users ORDER BY created_at ASC;",
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
			console.log("fetchAll completed on users table")
		}
	}

	async fetchById(id) {
		try {
			const query = {
				text: "SELECT * FROM users WHERE id = $1",
				values: [ id ]
			}

			const results = await pool.query(query)
			const result = results.rows[0]

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

	async fetchByName(name) {
		try {
			const query = {
				text: "SELECT * FROM users WHERE user_name = $1",
				values: [ name ]
			}

			const results = await pool.query(query)
			const result = results.rows[0]

			if (!result) {
				throw new Error(`User Name ${name} does not exist on users table.`)
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
			console.log("fetchOne completed on users table")
		}
	}

	async insertOne(id, userName, password) {
		let errMsg
		try {
			if (!id || !userName || !password) {
				errMsg = "Missing all required parameters."
				throw new Error(errMsg)
			}

			const result = await this.fetchById(id)

			if (!result.error) {
				errMsg = `User ID ${id} already exists.`
				throw new Error(errMsg)
			}

			const createdAt = new Date().toISOString()

			const query = {
				text: "INSERT INTO users (id, user_name, password, created_at) VALUES($1, $2, $3, $4);",
				values: [ id, userName, password, createdAt ]
			}

			await pool.query(query)

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
			if (!updates || !Object.keys(updates)) {
				errMsg = "No updates provided."
				throw new Error(errMsg)
			}

			const updateKeys = Object.keys(updates)

			const result = await this.fetchById(id)

			if (result.error) {
				errMsg = `User ID ${id} does not exist.`
				throw new Error(errMsg)
			}

			const allowedUpdates = [ "lastPageview", "password", "loggedIn", "userName" ]
			const updatesCheck = updateKeys.filter(update => allowedUpdates.includes(update))

			if (updatesCheck.length !== updateKeys.length) {
				throw new Error("Invalid update parameters provided.")
			}

			const updateQuery = updateOneUserQB(updates, updateKeys, id)

			const query = {
				text: updateQuery.text,
				values: updateQuery.values
			}
			
			await pool.query(query)

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
			console.log("updateOne completed on users table")
		}
	}
}

export default User
