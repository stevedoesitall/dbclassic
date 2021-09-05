import Favorite from "./favorites-model.js"

const favoriteController = {
	get: {
		async byUserId(req, res) {
			const userId = req.params.id
			const errMsg = {
				error: "Unauthorized user."
			}

			if (userId !== req.session.loginId) {
				return res.status(401).json(errMsg)
			}

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
			const userId = req.session.loginId
			const tweetId = req.body.tweetId
			const update = await new Favorite().addFavorite(userId, tweetId)
			let statusCode = 200

			if (!update.ok) {
				statusCode = 404
			}

			return res.status(statusCode).json(update)
		}
	},

	delete: {
		async removeOne(req, res) {
			const userId = req.session.loginId
			const tweetId = req.body.tweetId
			const update = await new Favorite().removeFavorite(userId, tweetId)
			let statusCode = 200

			if (!update.ok) {
				statusCode = 404
			}

			return res.status(statusCode).json(update)
		}
	}
}

export default favoriteController