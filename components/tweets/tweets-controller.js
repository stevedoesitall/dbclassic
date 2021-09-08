import Tweet from "./tweets-model.js"
const TABLE_NAME = "tweets"
const tweet = new Tweet(TABLE_NAME)

const tweetsController = {
	get: {
		async all(req, res) {
			let data
			
			if (req.query.text) {
				data = await tweet.fetchByText(req.query.text)
			} else if (req.query.date) {
				data = await tweet.fetchByDate(req.query.date)
			}
			else {
				data = await tweet.fetchAll()
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
			const data = await tweet.fetchById(id)

			if (!data.ok) {
				return res.status(404).json(data)
			}

			const result = data

			return res.status(200).json(result)
		},

		async byDate(req, res) {
			const date = req.query.date
			const data = await tweet.fetchByDate(date)

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
			const insert = await tweet.insertOne(id, text, createdAt)

			if (insert.error) {
				return res.status(404).json(insert)
			}

			return res.status(200).json(insert)
		},

		async addMany(req, res) {
			const tweets = req.body.data
			const insert = await tweet.insertMany(tweets)

			if (insert.error) {
				return res.status(404).json(insert)
			}

			return res.status(200).json(insert)
		}
	},

	patch: {
		//TBD
	},

	delete: {
		//TBD
	}
}

export default tweetsController
