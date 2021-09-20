import User from "../users/users-model.js"
import Tweet from "../tweets/tweets-model.js"
import Favorite from "../favorites/favorites-model.js"

const user = new User()
const tweet = new Tweet()
const favorite = new Favorite()

const pagesController = {
	async renderHome(req, res) {
		req.session.destroy((err) => {
			if (err) {
				console.log(err)
			}
		})
		const data = await tweet.fetchDates()
		const { loggedIn } = req.session
		const { allDates, yearHeaders } = data.results
		
		let isVerified = false
		let lastPageview = null

		if (req.session.loginId) {
			const userId = req.session.loginId
			const data = await user.fetchById(userId)
			isVerified = data.result.is_verified
			lastPageview = data.result.last_pageview
		}

		res.render("index", {
			message: "Really lookin' forward to the weekend, you guys.",
			lastPageview,
			loggedIn,
			yearHeaders,
			allDates,
			isVerified
		})
	},

	async renderTweet(req, res) {
		let isVerified = false

		if (req.session.loginId) {
			const userId = req.session.loginId
			const data = await user.fetchById(userId)
			isVerified = data.result.is_verified
		}

		const tweetId = req.params.id
		const data = await tweet.fetchById(tweetId)
		const { loggedIn } = req.session

		let isFavorite = false

		if (loggedIn) {
			const userId = req.session.loginId
			const result = await favorite.fetchByUserAndTweetIds(userId, tweetId)
			isFavorite = result.ok
		}
		
		if (data.error) {
			return res.render("error", {
				errMsg: data.error
			})
		}

		return res.render("tweet", {
			data: data.result,
			loggedIn,
			isFavorite,
			isVerified
		})
	},

	async renderDate(req, res) {
		let isVerified = false

		if (req.session.loginId) {
			const userId = req.session.loginId
			const data = await user.fetchById(userId)
			isVerified = data.result.is_verified
		}

		const date = req.query.date
		const data = await tweet.fetchByDate(date)
		const userId = req.session.loginId
		const favorites = []
		const { loggedIn } = req.session

		if (!data || data.error) {
			return res.render("error", {
				errMsg: "Something went wrong."
			})
		}

		const { rows, prevDate, nextDate, formattedDate } = data.results

		if (userId) {
			const favoritesData = await favorite.fetchByUserId(userId)

			if (favoritesData.ok) {
				favoritesData.results.forEach(tweet => favorites.push(tweet.tweet_id))
			}

			rows.map(row => row.isFavorite = favorites.includes(row.id))
		} 

		return res.render("date", {
			data: rows,
			prevDate: prevDate,
			nextDate: nextDate,
			date: formattedDate,
			loggedIn,
			isVerified
		})
	},

	async renderAccount(req, res) {
		const userId = req.session.loginId
	
		const data = await user.fetchById(userId)
		const favorites = await favorite.fetchByUserId(userId)
		const { result } = data

		res.render("account", {
			userName: result.user_name,
			favorites: favorites.results ? favorites.results : null,
			hasFavorites: favorites.results ? true : false
		})
	},

	async renderVerify(req, res) {
		console.log(req.params.id)
		res.render("verify")
	},

	async renderSearch(req, res) {
		res.render("search")
	},

	async renderLogin(req, res) {
		res.render("login")
	},

	async renderSignup(req, res) {
		res.render("signup")
	},

	async renderDelete(req, res) {
		res.render("delete")
	},

	async renderReset(req, res) {
		res.render("reset")
	},

	async renderError(req, res) {
		res.render("error", {
			errMsg: "Page doesn't exist. Kinda concerning?"
		})
	}
}

export default pagesController
