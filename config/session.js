import crypto from "node:crypto"
import session from "express-session"
import dotenv from "dotenv"
import redis from "redis"
import connectRedis from "connect-redis"

dotenv.config()

const RedisStore = connectRedis(session)
const client = redis.createClient(process.env.REDIS_URL)
const oneMonth = 30 * 24 * 60 * 60 * 1000

const sessionObj = {
	name: "momus_session",
	genid: () => {
		const uuid = crypto.randomUUID()
		return uuid
	},
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: false,
	cookie: {
		sameSite: true,
		maxAge: oneMonth
	},
	store: new RedisStore({
		client: client
	})
}

export default sessionObj