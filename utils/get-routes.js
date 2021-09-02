import { tweetsRouter } from "../components/tweets/tweets-route.js"
import { usersRouter } from "../components/users/users-route.js"
import { pagesRouter } from "../components/pages/pages-route.js"
import { favoritesRouter } from "../components/favorites/favorites-route.js"

const router = {
	tweets: tweetsRouter,
	users: usersRouter,
	pages: pagesRouter,
	favorites: favoritesRouter
}

export default router
