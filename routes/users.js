import express from "express"
import pkg from "pg"
import { prodCreds, devCreds } from "../config/db-creds.js"

const router = express.Router()

router.get("/:id", async (req, res) => {
	const id = req.params.id
	const { Pool } = pkg

	let credsToUse = prodCreds

	if (process.env.BASE_URL.includes("localhost")) {
		credsToUse = devCreds
	}

	const pool = new Pool(credsToUse)

	let errMsg

	try {
		const results = await pool.query(`SELECT * FROM users WHERE id = '${id}'`)
		const result = results.rows[0]

		if (!result) {
			errMsg = `No user found with ID: ${id}. Kinda concerning?`
			throw new Error(errMsg)
		}

		res.status(200).json(result)
	} catch (err) {
		res.status(404).json({
			error: err.toString()
		})
	} finally {
		pool.end()
	}
})

router.post("/:id", async (req, res) => {
	const id = req.params.id
	const { Pool } = pkg
	const lastPage = req.body.date
	let credsToUse = prodCreds

	if (process.env.BASE_URL.includes("localhost")) {
		credsToUse = devCreds
	}

	const pool = new Pool(credsToUse)

	//Let's build this out more. Just setting the user's last page for right now
	try {
		if (lastPage) {
			await pool.query(`UPDATE users SET last_pageview = '${lastPage}' WHERE id = '${id}';`)
		}

		res.status(200).json({"success": true})

	} catch (err) {
		console.log(err)
        
	} finally {
		pool.end()
	}
})

export { router as usersRouter }