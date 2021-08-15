import express from "express"
import usersController from "../../controllers/users.js"

const router = express.Router()

router.get("/id/:id", usersController.get.byId)
router.get("/name/:name", usersController.get.byName)
router.get("/", usersController.get.all)

router.post("/", usersController.post.addOne)

router.put("/", usersController.put.updateOne)

export { router as usersRouter }