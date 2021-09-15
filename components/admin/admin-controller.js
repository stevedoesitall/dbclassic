import User from "../users/users-model.js"

const user = new User()

const adminController = {
	async login(req, res) {
		const userName = req.body.userName
		const data = await user.fetchByName(userName)

		//Check if user doesn't exist vs. a username/password error
		if (!data.ok) {
			return res.status(401).json({
				error: "Unathorized user."
			})
		}

		const userId = data.result.id

		req.session.loggedIn = true
		req.session.loginId = userId
		req.session.lastPageview = data.result.last_pageview ? data.result.last_pageview : false

		const updates = {
			latest_session_id: req.sessionID
		}

		await user.updateOne(userId, updates)

		//Throw error if username/password mismatch
		res.status(200).json({
			ok: true,
			sessionId: req.sessionID
		})
	},

	async logout(req, res) {
		req.session.destroy((err) => {
			if (err) {
				console.log(err)
				return res.status(500).json({
					ok: false,
					error: "Something went wrong when attempting to log out; please try again later."
				})
			} else {
				return res.status(200).json({
					ok: true
				})
			}
		})
	}
}

export default adminController