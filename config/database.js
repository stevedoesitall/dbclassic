import dotenv from "dotenv"
import pkg from "pg"

dotenv.config()

const { Pool } = pkg
const enviornment = process.env.NODE_ENV

const prodCreds = {
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	port: 5432,
	ssl: {
		rejectUnauthorized: false
	}
}

const devCreds = {
	host: process.env.DEV_HOST,
	database: process.env.DEV_NAME,
	user: process.env.DEV_USER,
	password: process.env.DEV_PASS,
	port: 5432
}

const stagingCreds = {
	host: process.env.STAGE_HOST,
	database: process.env.STAGE_NAME,
	user: process.env.STAGE_USER,
	password: process.env.STAGE_PASS,
	port: 5432
}

let credsToUse

if (enviornment === "development") {
	credsToUse = devCreds
} else if (enviornment === "staging") {
	credsToUse = stagingCreds
} else {
	credsToUse = prodCreds
}

const pool = new Pool(credsToUse)

export default pool
