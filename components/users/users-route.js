import { Router } from "express"
import usersController from "./users-controller.js"

const router = Router()

router.get("/:id", usersController.get.byId)
router.get("/name/:name", usersController.get.byName)
router.get("/", usersController.get.all)

router.post("/", usersController.post.addOne)

router.patch("/", usersController.patch.updateOne)

export { router as usersRouter }