import User from "../users/users-model.js"
import Tweet from "../tweets/tweets-model.js"
import Favorite from "../favorites/favorites-model.js"

const USER_TABLE = "users"
const user = new User(USER_TABLE)

const TWEET_TABLE = "tweets"
const tweet = new Tweet(TWEET_TABLE)

const FAVORITE_TABLE = "users_tweets"
const favorite = new Favorite(FAVORITE_TABLE)

const pagesController = {
	async renderHome(req, res) {
		const userCookies = req.cookies
		const data = await tweet.fetchDates()
		const { lastPageview, loggedIn } = req.session
		const { allDates, yearHeaders } = data.results

		res.render("index", {
			message: "Really lookin' forward to the weekend, you guys.",
			lastPageview,
			loggedIn,
			yearHeaders,
			allDates
		})
	},

	async renderTweet(req, res) {
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
			isFavorite
		})
	},

	async renderDate(req, res) {
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
			loggedIn
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
