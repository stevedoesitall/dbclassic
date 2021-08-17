import User from "../models/User.js"
import Tweet from "../models/Tweet.js"

const pagesController = {
	async renderHome(req, res) {
		const tweet = new Tweet()
		const userCookies = req.cookies
		const data = await tweet.fetchDates()
		
		const { lastPageview, loggedIn } = req.session
		const { allDates, yearHeaders } = data.results

		res.render("index", {
			message: "Really lookin' forward to the weekend, you guys.",
			lastPageview,
			loggedIn,
			yearHeaders,
			allDates,
			userId: userCookies.momus_id
		})
	},

	async renderAccount(req, res) {
		const user = new User()
		const data = await user.fetchById(req.session.loginId)
		
		const { result } = data

		res.render("account", {
			userName: result.user_name
		})
	},

	async renderSearch(req, res) {
		res.render("search")
	},

	async renderLogin(req, res) {
		res.render("login")
	},

	async renderError(req, res) {
		res.render("error", {
			errMsg: "Page doesn't exist. Kinda concerning?"
		})
	}
}

export default pagesController
