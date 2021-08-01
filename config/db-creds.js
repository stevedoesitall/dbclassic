import dotenv from "dotenv"
dotenv.config()

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
	database: process.env.DEV_HOST,
	user: process.env.DEV_HOST,
	password: process.env.DEV_HOST,
	port: 5432
}

const stagingCreds = {
	host: process.env.STAGE_HOST,
	database: process.env.STAGE_HOST,
	user: process.env.STAGE_HOST,
	password: process.env.STAGE_HOST,
	port: 5432
}

export { prodCreds, devCreds, stagingCreds }