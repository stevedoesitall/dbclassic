import Tweet from "../models/Tweet.js"

const tweetsController = {
	get: {
		async all(req, res) {
			let data

			if (req.query.text) {
				data = await new Tweet().fetchByText(req.query.text)
			} else {
				data = await new Tweet().fetchAll()
			}

			const results = data.results

			if (!results.length) {
				return res.status(204).json()
			}
			return res.status(200).json({
				results
			})
		},

		async byId(req, res) {
			const id = req.params.id
			const data = await new Tweet().fetchById(id)

			if (data.error) {
				return res.render("error", {
					errMsg: data.error
				})
			}

			return res.render("tweet", {
				data: data.result
			})
		},

		async byDate(req, res) {
			const date = req.params.date
			const data = await new Tweet().fetchByDate(date)
			const { rows, prevDate, nextDate, formattedDate } = data.results

			if (data.error) {
				return res.render("error", {
					errMsg: data.error
				})
			}
			return res.render("date", {
				data: rows,
				prevDate: prevDate,
				nextDate: nextDate,
				date: formattedDate
			})
		},

		async dates(req, res) {
			const results = await new Tweet().fetchDates()

			if (results.error) {
				return res.status(404).json({
					error: results.error
				})
			}

			return res.status(200).json({ results })
		}
	},

	post: {
		async addOne(req, res) {
			const { id, text, created_at: createdAt } = req.body
			const insert = await new Tweet().insertOne(id, text, createdAt)

			if (insert.error) {
				return res.status(404).json({
					error: insert.error
				})
			}

			return res.status(200).json(insert)
		},

		async addMany(req, res) {
			const tweets = req.body.data
			const insert = await new Tweet().insertMany(tweets)

			if (insert.error) {
				return res.status(404).json({
					error: insert.error
				})
			}

			return res.status(200).json(insert)
		}
	},

	put: {
		//TBD
	},

	delete: {
		//TBD
	}
}

export default tweetsController
