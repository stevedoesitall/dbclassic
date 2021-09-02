import User from "../components/users/users-model.js"

const checkLogin = async (req, res, next) => {
	const userCookies = req.cookies

	if (userCookies.momus_id) {
		const user = new User()
		const data = await user.fetchById(userCookies.momus_id)
		const { result } = data

		req.session.loggedIn = result.logged_in ? true : false
		req.session.lastPageview = (result.last_pageview && result.logged_in) ? result.last_pageview : false
		req.session.loginId = userCookies.momus_id
	} else {
		req.session.loggedIn = false
		req.session.lastPageview = false
		req.session.loginId = null
	}

	next()
}

export default checkLogin