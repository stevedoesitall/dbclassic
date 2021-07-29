import { prodCreds, stagingCreds, devCreds } from "./config/db-creds.js"

const knexfile =  {
	development: {
		client: "postgresql",
		connection: devCreds
	},

	staging: {
		client: "postgresql",
		connection: stagingCreds,
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: "knex_migrations"
		}
	},

	production: {
		client: "postgresql",
		connection: {
			host: process.env.DB_HOST || prodCreds.host,
			database: process.env.DB_NAME || prodCreds.database,
			user: process.env.DB_USER || prodCreds.user,
			password: process.env.DB_PASS || prodCreds.password,
			port: 5432,
			ssl: { 
				rejectUnauthorized: false
			}
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: "knex_migrations"
		}
	}
}

export default knexfile