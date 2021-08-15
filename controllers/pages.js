import User from "../models/User.js"
import Tweet from "../models/Tweet.js"
import auth from "../middleware/auth.js"

const pagesController = {
	async renderHome(req, res) {
		const tweet = new Tweet()
		const userCookies = req.cookies
		const { lastPageview, loggedIn } = await auth(userCookies)
		const { allDates, yearHeaders } = await tweet.fetchDates() 
    
		if (!loggedIn) {
			res.clearCookie("momus_id")
		}
    
		req.session.loginId = userCookies.momus_id
    
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
		if (req.params.id !== req.session.loginId) {
			return res.render("error", {
				errMsg: "You don't have permission to access this page."
			})
		}
    
		const user = new User()
		const data = await user.fetchById(req.session.loginId)
    
		res.render("account", {
			userName: data.user_name
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