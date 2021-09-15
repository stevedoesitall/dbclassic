import User from "../components/users/users-model.js"

const user = new User()

const updateLastPageview = async (req, res, next) => {
	const date = req.query.date
	if (date) {
		const userSession = req.session
		if (userSession.loginId) {
			try {
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
