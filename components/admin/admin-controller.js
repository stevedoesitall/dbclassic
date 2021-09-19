import crypto from "node:crypto"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import transporter from "../../config/mail-creds.js"
import User from "../users/users-model.js"

dotenv.config()

const user = new User()
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
		//TBD
	},

	async checkName(req, res) {
		const userName = req.query.name
		const data = await user.fetchByName(userName)

		if (!data.ok) {
			return res.status(204).json({
				message: "Username doesn't exist."
			})
		}

		return res.status(200).json({
			message: "Username exists."
		})

	},

	async delete(req, res) {
		//Note to delete references to the users_tweets table too
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

		const password = await bcrypt.hash(req.body.password, SALT_ROUNDS)
		const token = "token-" + crypto.randomUUID()
		const tokenTime = new Date().toISOString()
		
		const values = {
			user_name: userName,
			password,
			token,
			token_time: tokenTime
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
			to: "stephenagiordano@gmail.com",
			subject: "Account verification for Momus.io",
			text: `Verify signup for ${userName}. Click here: ${process.env.BASE_URL}/verify/${token}`
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