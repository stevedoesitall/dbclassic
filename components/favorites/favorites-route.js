import { Router } from "express"
import favoriteController from "./favorites-controller.js"

const router = Router()

router.get("/:id", favoriteController.get.byUserId)
router.post("/", favoriteController.post.addOne)
router.delete("/", favoriteController.delete.removeOne)

export { router as favoritesRouter }