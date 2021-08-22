import dotenv from "dotenv"

dotenv.config({
	path: "../../../.env"
})

const mailCreds = {
	userName: process.env.MAIL_USER,
	password: process.env.MAIL_PASS
}

const twitterCreds = {
	authorization: process.env.AUTHORIZATION
}

export { mailCreds, twitterCreds }
