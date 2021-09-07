import Tweet from "./tweets-model.js"

const tweetsController = {
	get: {
		async all(req, res) {
			let data
			
			if (req.query.text) {
				data = await new Tweet().fetchByText(req.query.text)
			} else if (req.query.date) {
				console.log("BY DATE")
				data = await new Tweet().fetchByDate(req.query.date)
			}
			else {
				data = await new Tweet().fetchAll()
			}

			const results = data.results

			if (!results) {
				return res.status(204).json()
			}
			return res.status(200).json({
				results
			})
		},

		async byId(req, res) {
			const id = req.params.id
			const data = await new Tweet().fetchById(id)

			if (!data.ok) {
				return res.status(404).json(data)
			}

			const result = data

			return res.status(200).json(result)
		},

		async byDate(req, res) {
			console.log("BY DATE")
			const date = req.query.date
			const data = await new Tweet().fetchByDate(date)

			if (data.error) {
				return res.status(404).json(data)
			}

			const results = data.results

			return res.status(200).json(results)
		}
	},

	post: {
		async addOne(req, res) {
			const { id, text, created_at: createdAt } = req.body
			const insert = await new Tweet().insertOne(id, text, createdAt)

			if (insert.error) {
				return res.status(404).json(insert)
			}

			return res.status(200).json(insert)
		},

		async addMany(req, res) {
			const tweets = req.body.data
			const insert = await new Tweet().insertMany(tweets)

			if (insert.error) {
				return res.status(404).json(insert)
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
