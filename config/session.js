import crypto from "node:crypto"
import session from "express-session"
import dotenv from "dotenv"
import redis from "redis"
import connectRedis from "connect-redis"

dotenv.config()

const RedisStore = connectRedis(session)
const client = redis.createClient(process.env.REDIS_URL)

const sessionObj = {
	name: "momus_session",
	genid: () => {
		return crypto.randomUUID()
	},
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		sameSite: true,
		maxAge: 30 * 24 * 60 * 60 * 1000
	},
	store: new RedisStore({
		client: client
	})
}

export default sessionObj