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
		connection: process.env.DATABASE_URL || prodCreds,
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