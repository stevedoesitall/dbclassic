import express from "express"
import tweetsController from "../../controllers/tweets.js"

const router = express.Router()

router.get("/", tweetsController.get.all)
router.get("/:id", tweetsController.get.byId)
router.get("/date/:date", tweetsController.get.byDate)

router.post("/", tweetsController.post.addOne)

export { router as tweetsRouter }