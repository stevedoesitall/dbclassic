import { Router } from "express"
import favoriteController from "./favorites-controller.js"

const router = Router()

router.get("/:id", favoriteController.get.byUserId)

export { router as favoritesRouter }