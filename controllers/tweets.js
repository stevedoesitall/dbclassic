import Tweet from "../models/Tweet.js"

const tweetsController = {
	get: {
		async all(req, res) {
			let results
	
			if (req.query.text) {
				const text = req.query.text.toLowerCase()
				results = await new Tweet().fetchByText(text)
			} else {
				results = await new Tweet().fetchAll()
			}
		
			if (!results.length) {
				return res.status(204).json()
			}
		
			res.status(200).json(results)
		},
	
		async byId(req, res) {
			const id = req.params.id
	
			const result = await new Tweet().fetchOne(id)
			
			if (result.error) {
				return res.status(404).json({
					error: result.error
				})
			}
		
			result.text = result.text.replaceAll("&amp;", "&")
			
			res.status(200).json(result)
		},
	
		async byDate(req, res) {
			const date = req.params.date
			const results = await new Tweet().fetchByDate(date)
		
			if (!results) {
				const errMsg = `No tweet found from this date: ${date}. Kinda concering?`
		
				return res.status(404).json({
					error: errMsg
				})
			}
		
			res.status(200).json(results)
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
                
			res.status(200).json(insert)
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