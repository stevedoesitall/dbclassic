import User from "./users-model.js"

const user = new User()

const usersController = {
	get: {
		async all(req, res) {
			const data = await user.fetchAll()
			const { results } = data

			if (!results.length) {
				return res.status(204).json()
			}

			return res.status(200).json(results)
		},

		async byId(req, res) {
			const id = req.params.id
			const data = await user.fetchById(id)
			
			if (data.error) {
				return res.status(404).json(data)
			}

			const result = data

			return res.status(200).json(result)
		},

		async byName(req, res) {
			const name = req.params.name
			const data = await user.fetchByName(name)

			if (data.error) {
				return res.status(404).json(data)
			}

			return res.status(200).json(data)
		}
	},

	post: {
		async addOne(req, res) {
			const { id, values } = req.body
			const insert = await user.insertOne(id, values)

			if (insert.error) {
				return res.status(404).json(insert)
			}

			return res.status(200).json(insert)
		}
	},

	patch: {
		async updateOne(req, res) {
			const { id, updates } = req.body
			const update = await user.updateOne(id, updates)

			if (update.error) {
				return res.status(404).json({
					error: update.error
				})
			}

			return res.status(200).json(update)
		}
	},

	delete: {
		//TBD
	}
}

export default usersController
