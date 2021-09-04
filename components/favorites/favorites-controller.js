import Favorite from "./favorites-model.js"

const favoriteController = {
	get: {
		async byUserId(req, res) {
			const userId = req.params.id
			const data = await new Favorite().fetchByUserId(userId)

			if (!data.ok) {
				return res.status(404).json(data)
			}

			const result = data

			return res.status(200).json(result)
		}
	},

	post: {
		async addOne(req, res) {
			return res.status(200).json({
				ok: true,
				method: "POST"
			})
		}
	},

	delete: {
		async removeOne(req, res) {
			return res.status(200).json({
				ok: true,
				method: "DELETE"
			})
		}
	}
}

export default favoriteController