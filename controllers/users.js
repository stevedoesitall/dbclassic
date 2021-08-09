import User from "../models/User.js"

const usersController = {
	get: {
		async all(req, res) {
			const results = await new User().fetchAll()
        
			if (!results.length) {
				return res.status(204).json()
			}
        
			res.status(200).json(results)
		},
    
		async byId(req, res) {
			const id = req.params.id
    
			const result = await new User().fetchOne(id)
            
			if (result.error) {
				return res.status(404).json({
					error: result.error
				})
			}
                
			res.status(200).json(result)
		}
	},

	post: {
		async addOne(req, res) {
			const { id, userName, password } = req.body
			const insert = await new User().insertOne(id, userName, password)

			if (insert.error) {
				return res.status(404).json({
					error: insert.error
				})
			}
                
			res.status(200).json(insert)
		}
	},

	put: {
		// async byId(req, res) {
		// 	const id = req.params.id
		// 	//Fix this
		// 	const updates = req.body.updates
            
		// 	if (updates.lastPage) {
		// 		const lastPage = updates.lastPage
		//         const result = await new User()
		// 	}
		// }
	},

	delete: {
		//TBD
	}
}

export default usersController