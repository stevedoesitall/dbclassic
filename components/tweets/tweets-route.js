import { Router } from "express"
import tweetsController from "./tweets-controller.js"

const router = Router()

router.get("/:id", tweetsController.get.byId)
router.get("/", tweetsController.get.all)

router.post("/bulk", tweetsController.post.addMany)
router.post("/", tweetsController.post.addOne)

export { router as tweetsRouter }