import crypto from "node:crypto"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import transporter from "../../config/mail-creds.js"
import validateEmail from "../../utils/validate-email.js"
import User from "../users/users-model.js"
import Favorite from "../favorites/favorites-model.js"

dotenv.config()

const user = new User()
const favorite = new Favorite()
const SALT_ROUNDS = 10

const adminController = {
	async login(req, res) {
		const userName = req.body.userName
		const password = req.body.password

		const data = await user.fetchByName(userName)

		if (!data.ok) {
			return res.status(404).json({
				error: "Username doesn't exist."
			})
		}

		const passwordMatch = await bcrypt.compare(password, data.result.password)
		if (!passwordMatch) {
			return res.status(401).json({
				error: "Incorrect password"
			})
		}

		const userId = data.result.id

		req.session.loggedIn = true
		req.session.loginId = userId
		req.session.lastPageview = data.result.last_pageview ? data.result.last_pageview : false

		const updates = {
			latest_session_id: req.sessionID
		}

		await user.updateOne(userId, updates)

		res.status(200).json({
			ok: true,
			sessionId: req.sessionID
		})
	},

	async logout(req, res) {
		req.session.destroy((err) => {
			if (err) {
				console.log(err)
				return res.status(500).json({
					ok: false,
					error: "Something went wrong when attempting to log out; please try again later."
				})
			} else {
				return res.status(200).json({
					ok: true
				})
			}
		})
	},

	async reset(req, res) {
		const data = await user.fetchByEmail(req.body.email)

		if (!data.ok) {
			return res.status(204).json()
		}

		const email = data.result.email
		const mailOptions = {
			from: "momusio@yahoo.com",
			to: email
		}

		if (req.body.type === "send-username") {
			const userName = data.result.user_name

			mailOptions.subject = "Your Momus.io Username"
			mailOptions.html = `Your username is: <b>${userName}</b>.`
			mailOptions.text = `Your username is: ${userName}.`
		} else if (req.body.type === "reset-password") {
			const userId = data.result.id
			const resetToken = "token-" + crypto.randomUUID()
			const resetTokenTime = new Date().toISOString()

			const values = {
				reset_token: resetToken,
				reset_verified: false,
				reset_token_time: resetTokenTime
			}
	
			const update = await user.updateOne(userId, values)
			console.log(update)

			mailOptions.subject = "Reset Your Momus.io Password"
			mailOptions.html = `Click <a href="${process.env.BASE_URL}/reset/${resetToken}">here</a> to reset your password.`
			mailOptions.text = `Click here to reset your password: ${process.env.BASE_URL}/reset/${resetToken}.`
		}

		transporter.sendMail(mailOptions, (err, res) => {
			if (err) {
				console.log(err)
			} else {
				console.log(res)
			}
		})

		return res.status(200).json({
			ok: true
		})
	},

	async checkUser(req, res) {
		let data
		let type

		if (req.query.name) {
			type = "Username"
			const userName = req.query.name
			data = await user.fetchByName(userName)
		} else if (req.query.email) {
			type = "Email"
			const userEmail = req.query.email
			data = await user.fetchByEmail(userEmail)
		}

		if (!data.ok) {
			return res.status(204).json({
				message: `${type} doesn't exist.`
			})
		}

		return res.status(200).json({
			message: `${type} exists.`
		})

	},

	async delete(req, res) {
		let errMsg

		try {
			const userId = req.session.loginId

			if (!userId) {
				errMsg = "No user ID found."
				throw new Error(errMsg)
			}

			await favorite.deleteByUserId(userId)
			await user.deleteOne(userId)

			req.session.destroy((err) => {
				if (err) {
					console.log(err)
				}
			})

			return res.status(200).json({
				ok: true
			})

		} catch(err) {
			console.log(err)
			return {
				ok: false,
				error: errMsg
			}
		}

	},

	async signup(req, res) {
		const userId = "MID-" + crypto.randomUUID()
		const userName = req.body.userName

		const data = await user.fetchByName(userName)

		if (data.ok) {
			return res.status(303).json({
				ok: false,
				error: "Username taken."
			})
		}

		if (req.body.password !== req.body.confirmPassword) {
			return res.status(401).json({
				ok: false,
				error: "Passwords don't match."
			})
		}

		if (!validateEmail(req.body.email)) {
			return res.status(401).json({
				ok: false,
				error: "Invalid email address."
			})
		}

		const password = await bcrypt.hash(req.body.password, SALT_ROUNDS)
		const token = "token-" + crypto.randomUUID()
		const tokenTime = new Date().toISOString()
		const email = req.body.email.toLowerCase()

		const values = {
			user_name: userName,
			password,
			token,
			token_time: tokenTime,
			email: email
		}

		const insert = await user.insertOne(userId, values)

		if (!insert.ok) {
			return res.status(401).json({
				ok: false,
				error: "Authentication error. Please try again."
			})
		}

		const mailOptions = {
			from: "momusio@yahoo.com",
			to: email,
			subject: "Account verification for Momus.io",
			html: `Verify signup for <b>${userName}</b>. Click <a href="${process.env.BASE_URL}/verify/${token}">here.`,
			text: `Verify signup for ${userName}. Click here: ${process.env.BASE_URL}/verify/${token}.`
		}
		
		transporter.sendMail(mailOptions, (err, res) => {
			if (err) {
				console.log(err)
			} else {
				console.log(res)
			}
		})
		
		req.session.loggedIn = true
		req.session.loginId = userId

		//Add error handling
		res.status(200).json({
			ok: true
		})
	}
}

export default adminController