import User from "../components/users/users-model.js"

const updateLastPageview = async (req, res, next) => {
	const date = req.query.date
	if (date) {
		const userCookies = req.cookies
		const userSession = req.session
		if (userCookies.momus_id === userSession.loginId) {
			try {
				const user = new User()
				const updates = {
					last_pageview: date
				}
				await user.updateOne(userSession.loginId, updates)
			} catch (err) {
				console.log(err)
			}
		}
	}
	next()
}

export default updateLastPageview
