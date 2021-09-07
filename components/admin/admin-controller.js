import User from "../users/users-model.js"

const adminController = {
	async login(req, res) {
		const userName = req.body.userName
		const data = await new User().fetchByName(userName)
		const userId = data.result.id
		const cookieObj = {
			sameSite: "strict",
			httpOnly: true
		}

		if (!data.ok) {
			return res.status(401).json({
				error: "Unathorized user."
			})
		}

		req.session.loggedIn = true
		req.session.loginId = userId

		res.cookie("momus_id", userId, cookieObj)
		const update = await new User().updateOne(userId, "latestSessionId", req.sessionID)

		//Throw error if username/password mismatch
		res.status(200).json({
			sessionId: req.sessionID
		})
	},

	async logout(req, res) {
		req.session.destroy((err) => {
			if (err) {
				console.log(err)
				return res.status(500).json({
					ok: false,
					error: "Something went wrong when trying to log out; please try again later."
				})
			} else {
				console.log("Success")
				res.clearCookie("momus_id")
				return res.status(200).json({
					ok: true
				})
			}
		})

	}
}

export default adminController