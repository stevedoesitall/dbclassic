import Model from "./Model.js"
import pool from "../config/database.js"
import _ from "./utils/index.js"

const modelTable = "users"

class User extends Model {
	#table

	constructor(table) {
		super((table = modelTable))
		this.#table = modelTable
	}

	async fetchAll() {
		let errMsg

		try {
			const query = `SELECT * FROM ${this.#table} ORDER BY created_at ASC;`

			const results = await pool.query(query)

			if (!results.rows.length) {
				errMsg = "No results found."
				throw new Error(errMsg)
			}

			return {
				ok: true,
				results: results.rows
			}
		} catch (err) {
			console.log(errMsg)

			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log(`fetchAll completed on ${this.#table} table`)
		}
	}

	async fetchById(id) {
		let errMsg

		try {
			const results = await pool.query(
				`SELECT * FROM ${this.#table} WHERE id = '${id}';`
			)
			const result = results.rows[0]

			if (!result) {
				errMsg = `ID ${id} does not exist on ${this.#table} table.`
				throw new Error(errMsg)
			}

			return {
				ok: true,
				result
			}
		} catch (err) {
			console.log(errMsg)
			
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log(`fetchById completed on ${this.#table} table`)
		}
	}

	async fetchByName(name) {
		let errMsg

		try {
			const results = await pool.query(
				`SELECT * FROM ${this.#table} WHERE user_name = '${name}';`
			)
			const result = results.rows[0]

			if (!result) {
				errMsg = `User Name ${name} does not exist on ${this.#table} table.`
				throw new Error(errMsg)
			}

			return {
				ok: true,
				result
			}
		} catch (err) {
			console.log(errMsg)
			
			return {
				ok: false,
				error: errMsg
			}
		} finally {
			console.log(`fetchOne completed on ${this.#table} table`)
		}
	}

	async insertOne(id, userName, password) {
		let errMsg

		try {
			if (!id || !userName || password) {
				errMsg = `Missing all required parameters.`
				throw new Error(errMsg)
			}

			const result = await this.fetchOne(id)

			if (!result.error) {
				errMsg = `User ID ${id} already exists.`
				throw new Error(errMsg)
			}

			const createdAt = new Date().toISOString()

			await pool.query(`
                INSERT INTO ${this.#table} (id, user_name, password, created_at)
                VALUES ('${id}', '${userName}', '${password}', '${createdAt}');
            `)

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
			console.log(`insertOne completed on ${this.#table} table`)
		}
	}

	async updateOne(id, updates) {
		let errMsg

		try {
			const updateKeys = Object.keys(updates)

			if (!updateKeys.length) {
				errMsg = "No updates provided."
				throw new Error(errMsg)
			}

			const allowedUpdates = ["lastPageview", "password", "loggedIn"]
			const updatesCheck = updateKeys.filter((update) =>
				allowedUpdates.includes(update)
			)

			if (updatesCheck.length !== updateKeys.length) {
				errMsg = "Invalid update parameters provided."
				throw new Error(errMsg)
			}

			const updateQuery = _.updateOneUserQB(
				updates,
				updateKeys,
				id,
				this.#table
			)

			await pool.query(updateQuery)

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
			console.log(`updateOne completed on ${this.#table} table`)
		}
	}
}

export default User
