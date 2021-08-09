import express from "express"
import usersController from "../../controllers/users.js"

const router = express.Router()

router.get("/", usersController.get.all)
router.get("/:id", usersController.get.byId)

router.post("/", usersController.post.addOne)

export { router as usersRouter }