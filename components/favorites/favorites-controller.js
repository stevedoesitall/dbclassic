import Favorite from "./favorites-model.js"

const favorite = new Favorite()

const favoriteController = {
	get: {
		async byUserId(req, res) {
			const userId = req.params.id
			const type = req.query.type || null
			const data = await favorite.fetchByUserId(userId, type)

			if (!data.ok) {
				return res.status(204).json()
			}

			const result = data

			return res.status(200).json(result)
		}
	},

	post: {
		async addOne(req, res) {
			const userId = req.session.loginId || req.body.userId
			const tweetId = req.body.tweetId
			const update = await favorite.addFavorite(userId, tweetId)
			let statusCode = 200

			if (!update.ok) {
				statusCode = 404
			}

			return res.status(statusCode).json(update)
		}
	},

	delete: {
		async removeOne(req, res) {
			const userId = req.session.loginId || req.body.userId
			const tweetId = req.body.tweetId
			const update = await favorite.removeFavorite(userId, tweetId)
			let statusCode = 200

			if (!update.ok) {
				statusCode = 404
			}

			return res.status(statusCode).json(update)
		}
	}
}

export default favoriteController