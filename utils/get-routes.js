import { tweetsRouter } from "../components/tweets/tweets-route.js"
import { usersRouter } from "../components/users/users-route.js"
import { pagesRouter } from "../components/pages/pages-route.js"

const router = {
	tweets: tweetsRouter,
	users: usersRouter,
	pages: pagesRouter
}

export default router
