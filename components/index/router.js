import { tweetsRouter } from "../tweets/tweets-route.js"
import { usersRouter } from "../users/users-route.js"
import { pagesRouter } from "../pages/pages-route.js"
import { favoritesRouter } from "../favorites/favorites-route.js"
import { adminRouter } from "../admin/admin-route.js"

const router = {
	tweets: tweetsRouter,
	users: usersRouter,
	pages: pagesRouter,
	favorites: favoritesRouter,
	admin: adminRouter
}

export default router