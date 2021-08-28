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
			userId: userCookies.momus_id ? userCookies.momus_id : null
		})
	},

	async renderTweet(req, res) {
		const id = req.params.id
		const data = await new Tweet().fetchById(id)
		
		if (data.error) {
			return res.render("error", {
				errMsg: data.error
			})
		}

		return res.render("tweet", {
			data: data.result
		})
	},

	async renderDate(req, res) {
		const date = req.query.date
		let data
		
		//Add validation for date format
		if (date) {
			data = await new Tweet().fetchByDate(date)
		}

		if (!data || data.error) {
			return res.render("error", {
				errMsg: "Something went wrong."
			})
		}

		const { rows, prevDate, nextDate, formattedDate } = data.results

		return res.render("date", {
			data: rows,
			prevDate: prevDate,
			nextDate: nextDate,
			date: formattedDate
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
