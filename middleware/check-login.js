import User from "../components/users/users-model.js"

const USER_TABLE = "users"
const user = new User(USER_TABLE)

const checkLogin = async (req, res, next) => {
	const userCookies = req.cookies

	if (userCookies.momus_id && (userCookies.momus_id === req.session.loginId)) {
		const data = await user.fetchById(userCookies.momus_id)
		const { result } = data
		req.session.lastPageview = result.last_pageview ? result.last_pageview : false
	} else {
		req.session.loggedIn = false
		req.session.lastPageview = false
		req.session.loginId = null
	}

	next()
}

export default checkLogin