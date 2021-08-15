import { tweetsRouter } from "./api/tweets.js"
import { usersRouter } from "./api/users.js"
import { pagesRouter } from "./pages/pages.js"

const router = {
	tweets: tweetsRouter,
	users: usersRouter,
	pages: pagesRouter
}

export default router