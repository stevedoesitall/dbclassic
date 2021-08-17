import User from "../models/User.js"

const checkLogin = async (req, res, next) => {
	const userCookies = req.cookies

	if (userCookies.momus_id) {
		const user = new User()
		const data = await user.fetchById(userCookies.momus_id)
		req.session.loggedIn = data.logged_in ? true : false
		req.session.lastPageview = data.last_pageview && data.logged_in ? data.last_pageview : false
		req.session.loginId = userCookies.momus_id

		if (!req.session.loggedIn) {
			res.clearCookie("momus_id")
		}
	}
	
	next()
}

export default checkLogin