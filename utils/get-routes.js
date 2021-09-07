import { tweetsRouter } from "../components/tweets/tweets-route.js"
import { usersRouter } from "../components/users/users-route.js"
import { pagesRouter } from "../pages/pages-route.js"
import { favoritesRouter } from "../components/favorites/favorites-route.js"
import { adminRouter } from "../components/admin/admin-route.js"

const router = {
	tweets: tweetsRouter,
	users: usersRouter,
	pages: pagesRouter,
	favorites: favoritesRouter,
	admin: adminRouter
}

export default router