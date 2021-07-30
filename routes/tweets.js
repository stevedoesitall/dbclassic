import express from "express"
import Knex from "knex"
import knexfile from "../config/knexfile.js"
import Tweet from "../models/Tweet.js"

const router = express.Router()

router.get("/", async (req, res) => {
	const knex = Knex(knexfile.production)

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

		const results = await knex.raw(`SELECT * FROM tweets ${textQuery ? textQuery : ""} ORDER BY created_at ${sort} ;`)

		if (!results.rows.length) {
			return res.status(204).json()
		}

		res.status(200).json(results.rows)

	} catch (err) {
		res.status(404).json({
			error: err.toString()
		})

	} finally {
		knex.destroy(() => {
			console.log("Connection destroyed.")
		})
	}
})

router.get("/:id", async (req, res) => {
	const id = req.params.id
	const knex = Knex(knexfile.production)
	let errMsg

	try {
		const result = await Tweet.query().findById(id)

		if (!result) {
			errMsg = `No tweet found with ID: ${id}. Kinda concering?`
			throw new Error(errMsg)
		}

		res.status(200).json(result)
	} catch (err) {
		res.status(404).json({
			error: err.toString()
		})
	} finally {
		knex.destroy(() => {
			console.log("Connection destroyed.")
		})
	}
})

router.get("/date/:date", async (req, res) => {
	const date = req.params.date
	const knex = Knex(knexfile.production)
	let errMsg

	try {
		const results = await knex.raw(`SELECT * FROM tweets WHERE to_char(created_at AT TIME ZONE 'GMT-05:00 DST', 'YYYY-MM-DD') = '${date}' ORDER BY created_at asc;`)

		if (!results.rows.length) {
			errMsg = `No tweet found from this date: ${date}. Kinda concering?`
			throw new Error(errMsg)
		}

		res.status(200).json(results.rows)
	} catch (err) {
		res.status(404).json({
			error: err.toString()
		})
	} finally {
		knex.destroy(() => {
			console.log("Connection destroyed.")
		})
	}
})

export { router as tweetsRouter }