import User from "../models/User.js"

const usersController = {
	get: {
		async all(req, res) {
			const data = await new User().fetchAll()

			const { results } = data

			if (!results.length) {
				return res.status(204).json()
			}

			return res.status(200).json(results)
		},

		async byId(req, res) {
			const id = req.params.id
			const result = await new User().fetchById(id)

			if (result.error) {
				return res.status(404).json({
					error: result.error
				})
			}

			return res.status(200).json(result)
		},

		async byName(req, res) {
			const name = req.params.name
			const result = await new User().fetchByName(name)

			if (result.error) {
				return res.status(404).json({
					error: result.error
				})
			}

			res.cookie("momus_id", result.result.id, {
				sameSite: "strict",
				httpOnly: true
			})

			return res.status(200).json(result)
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

			return res.status(200).json(insert)
		}
	},

	put: {
		async updateOne(req, res) {
			const { id, updates } = req.body
			const update = await new User().updateOne(id, updates)

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
