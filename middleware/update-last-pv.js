import User from "../models/User.js"

const updateLastPageview = async (req, res, next) => {
	const userCookies = req.cookies
	const date = req.params.date

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

	next()
}

export default updateLastPageview