import { tweetsRouter } from "./api/tweets.js"
import { usersRouter } from "./api/users.js"

const router = {
	tweets: tweetsRouter,
	users: usersRouter
}

export default router