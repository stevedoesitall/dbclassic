import express from "express"
import usersController from "../../controllers/users.js"
import setCookie from "../../middleware/set-cookie.js"

const router = express.Router()

router.get("/:id", usersController.get.byId)
router.get("/name/:name", usersController.get.byName)
router.get("/", usersController.get.all)

router.post("/", usersController.post.addOne)

router.put("/", setCookie, usersController.put.updateOne)

export { router as usersRouter }