import dotenv from "dotenv"
import nodemailer from "nodemailer"

dotenv.config()

const mailCreds = {
	userName: process.env.MAIL_USER,
	password: process.env.MAIL_PASS
}

const transporter = nodemailer.createTransport({
	host: "smtp.mail.yahoo.com",
	port: 465,
	secure: false,
	service: "yahoo",
	auth: {
		user: mailCreds.userName,
		pass: mailCreds.password
	},
	debug: false,
	logger: true
})

export default transporter