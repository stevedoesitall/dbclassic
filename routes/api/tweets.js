import express from "express"
import tweetsController from "../../controllers/tweets.js"

const router = express.Router()

router.get("/", tweetsController.get.all)
router.get("/:id", tweetsController.get.byId)
router.get("/date/:date", tweetsController.get.byDate)

router.post("/one", tweetsController.post.addOne)
router.post("/many", tweetsController.post.addMany)

export { router as tweetsRouter }