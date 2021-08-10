import express from "express"
import usersController from "../../controllers/users.js"

const router = express.Router()

router.get("/", usersController.get.all)
router.get("/id/:id", usersController.get.byId)
router.get("/name/:name", usersController.get.byName)

router.post("/", usersController.post.addOne)

router.put("/", usersController.put.updateOne)

export { router as usersRouter }