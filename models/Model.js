import { pool } from "../config/database.js"

class Model {
    
    #table
    
	constructor(table) {
        this.#table = table
	}
    
    async fetchAll() {
        let query = `SELECT * FROM ${this.#table} ORDER BY created_at ASC;`
        
        if (this.#table === "tweets") {
            query = `SELECT id, text, created_at AT TIME ZONE 'GMT-05:00 DST' AS date FROM ${this.#table} ORDER BY created_at ASC;`
        }

        try {
            const results = await pool.query(query)

            if (!results.rows.length) {
                throw new Error("No results found.")
            }

            return results.rows

        } catch(err) {
            console.log(err)

        } finally {
            console.log(`fetchAll completed on ${this.#table} table`)
        }
    }

    async fetchOne(id) {
        let errMsg

        try {
            const results = await pool.query(`SELECT * FROM ${this.#table} WHERE id = '${id}';`)
            const result = results.rows[0]

            if (!result) {
                errMsg = `ID ${id} does not exist on ${this.#table} table.`
                throw new Error(errMsg)
            }

            return result

        } catch(err) {
            return {
                error: errMsg
            }

        } finally {
            console.log(`fetchOne completed on ${this.#table} table`)
        }
    }
}

export default Model