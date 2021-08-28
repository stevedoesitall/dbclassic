import User from "../components/users/users-model.js"

const updateLastPageview = async (req, res, next) => {
	const date = req.query.date
	if (date) {
		const userCookies = req.cookies
		if (userCookies.momus_id) {
			try {
				const user = new User()
				const updates = {
					lastPageview: date
				}
	
				await user.updateOne(userCookies.momus_id, updates)
			} catch (err) {
				console.log(err)
			}
		}
	}
	next()
}

export default updateLastPageview
