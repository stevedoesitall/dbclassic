
import Model from "./Model.js"
import { pool } from "../config/database.js"

const modelTable = "users"

class User extends Model {
    #table

    constructor(table) {
        super(table = modelTable)
        this.#table = modelTable
    }

    async insertOne(id, userName, password) {
        let errMsg
        try {
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
            return {
                error: errMsg
            }
        }

        finally {
            console.log(`insertOne completed on ${this.#table} table`)
        }
    }

    async updateOne(id, updates) {

    }
}

export default User