
import Tweet from "../models/Tweet.js"

const tweetsController = {
	get: {
		async all(req, res) {
			let results
	
			if (req.query.text) {
				results = await new Tweet().fetchByText(req.query.text)
			} else {
				results = await new Tweet().fetchAll()
			}

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
			
			if (data.error) {		
				return res.render("error", {
					errMsg: data.error
				})
			}
			return res.render("date", {
				data: data.rows,
				prevDate: data.prevDate,
				nextDate: data.nextDate,
				date: data.formattedDate
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