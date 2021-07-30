import dotenv from "dotenv"
// import { prodCreds, devCreds } from "../config/db-creds.js"
dotenv.config()

const knexfile =  {
	// development: {
	// 	client: "postgresql",
	// 	connection: {
	// 		host: devCreds.host,
	// 		database: devCreds.database,
	// 		user: devCreds.user,
	// 		password: devCreds.password,
	// 		port: 5432
	// 	},
	// },

	// staging: {
	// 	client: "postgresql",
	// 	connection: {
	// 		host: process.env.DB_HOST,
	// 		database: process.env.DB_NAME,
	// 		user: process.env.DB_USER,
	// 		password: process.env.DB_PASS,
	// 		port: 5432,
	// 		ssl: { 
	// 			rejectUnauthorized: false
	// 		}
	// 	},
	// 	pool: {
	// 		min: 2,
	// 		max: 10
	// 	},
	// 	migrations: {
	// 		tableName: "knex_migrations"
	// 	}
	// },

	production: {
		client: "postgresql",
		connection: {
			host: process.env.DB_HOST,
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			port: 5432,
			ssl: { 
				rejectUnauthorized: false
			}
		},
		pool: {
			min: 2,
			max: 10
		}
	}
}

export default knexfile