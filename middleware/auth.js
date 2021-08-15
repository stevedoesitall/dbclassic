import User from "../models/User.js"

const auth = async (userCookies) => {
	let lastPageview
	let loggedIn

	if (userCookies.momus_id) {
		const user = new User()
		const data = await user.fetchById(userCookies.momus_id)
		loggedIn = data.logged_in ? true : false
		lastPageview = data.last_pageview && loggedIn ? data.last_pageview : false
	}

	return { lastPageview, loggedIn }
}

export default auth