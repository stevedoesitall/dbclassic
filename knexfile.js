import dotenv from "dotenv"
dotenv.config()

const knexfile =  {
	development: {
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
	},

	staging: {
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
		},
		migrations: {
			tableName: "knex_migrations"
		}
	},

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
		},
		migrations: {
			tableName: "knex_migrations"
		}
	}
}

export default knexfile