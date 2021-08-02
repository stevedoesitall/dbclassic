import express from "express"
import pkg from "pg"
import { prodCreds } from "../config/db-creds.js"

const router = express.Router()

router.get("/", async (req, res) => {
	const { Pool } = pkg
	const pool = new Pool(prodCreds)

	try {
		//Update search by date
		const queryObj = {}
		let sort = "asc"
		let startDate
		let endDate
		let textQuery

		if (req.query.sort === "desc") {
			sort = "desc"
		}

		//Implement this; not currently functional
		if (req.query.start_date || req.query.end_date) {
			queryObj.created_at = {}
		}

		if (req.query.start_date) {
			startDate = new Date(req.query.start_date)
			queryObj.created_at.gte = startDate
		}

		if (req.query.end_date) {
			endDate = new Date(req.query.end_date)
			queryObj.created_at.lte = endDate
		}

		if (startDate && endDate && startDate > endDate) {
			throw new Error("End date cannot be before the start date")
		}

		if (req.query.text) {
			const text = req.query.text.toLowerCase()
			textQuery = `WHERE text ILIKE '%${text}%'`
		}

		const results = await pool.query(`SELECT * FROM tweets ${textQuery ? textQuery : ""} ORDER BY created_at ${sort} ;`)

		if (!results.rows.length) {
			return res.status(204).json()
		}

		res.status(200).json(results.rows)

	} catch (err) {
		res.status(404).json({
			error: err.toString()
		})

	} finally {
		pool.end()
	}
})

router.get("/:id", async (req, res) => {
	const id = req.params.id
	const { Pool } = pkg
	const pool = new Pool(prodCreds)

	let errMsg

	try {
		const results = await pool.query(`SELECT * FROM tweets WHERE id = '${id}'`)
		const result = results.rows[0]

		if (!result) {
			errMsg = `No tweet found with ID: ${id}. Kinda concerning?`
			throw new Error(errMsg)
		}

		result.text = result.text.replaceAll("&amp;", "&")
		res.status(200).json(result)
	} catch (err) {
		res.status(404).json({
			error: err.toString()
		})
	} finally {
		pool.end()
	}
})

router.get("/date/:date", async (req, res) => {
	const date = req.params.date
	const { Pool } = pkg
	const pool = new Pool(prodCreds)

	let errMsg

	try {
		const results = await pool.query(`SELECT * FROM tweets WHERE to_char(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') = '${date}' ORDER BY created_at asc;`)

		if (!results.rows.length) {
			errMsg = `No tweet found from this date: ${date}. Kinda concering?`
			throw new Error(errMsg)
		}

		results.rows.map(row => {
			row.text = row.text.replaceAll("&amp;", "&")
		})

		res.status(200).json(results.rows)
	} catch (err) {
		res.status(404).json({
			error: err.toString()
		})
	} finally {
		pool.end()
	}
})

export { router as tweetsRouter }