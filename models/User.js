
import Model from "./Model.js"
import { pool } from "../config/database.js"

const modelTable = "users"

class User extends Model {
    #table

    constructor(table) {
        super(table = modelTable)
        this.#table = modelTable
    }

    async fetchByName(name) {
        let errMsg

        try {
            const results = await pool.query(`SELECT * FROM ${this.#table} WHERE user_name = '${name}';`)
            const result = results.rows[0]

            if (!result) {
                errMsg = `User Name ${name} does not exist on ${this.#table} table.`
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
        let errMsg

        try {
            const updateKeys = Object.keys(updates)
            const allowedUpdates = [ "lastPageview", "password" ]
            const updatesCheck = updateKeys.filter(update => allowedUpdates.includes(update))

            if (updatesCheck.length !== updateKeys.length) {
                errMsg = "Invalid update parameters provided." 
                throw new Error(errMsg)
            }

            const fieldsMap = {
                lastPageview: "last_pageview",
                password: "password"
            }

            const lastUpdateDate = new Date().toISOString()

            let updateQuery = `UPDATE ${this.#table} SET last_update_date = '${lastUpdateDate}', `

            updateKeys.forEach((update, index) => {
                const column = fieldsMap[update]
                if (updateKeys.length === (index + 1)) {
                    updateQuery = updateQuery + `${column} = '${updates[update]}'`
                } else {
                    updateQuery = updateQuery + `${column} = '${updates[update]}', `
                }
            })

            updateQuery = updateQuery + ` WHERE id = '${id}'`

            await pool.query(updateQuery)

            return {
                ok: true
            }

        } catch(err) {
            return {
                error: errMsg
            }
        } finally {
            console.log(`updateOne completed on ${this.#table} table`)
        }

    }
}

export default User