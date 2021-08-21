import express from "express"
import updateLastPageview from "../../middleware/update-last-pv.js"
import tweetsController from "../../controllers/tweets.js"

const router = express.Router()

router.get("/:id", tweetsController.get.byId)
router.get("/dates", tweetsController.get.dates)
router.get("/date/:date", updateLastPageview, tweetsController.get.byDate)
router.get("/", tweetsController.get.all)

router.post("/one", tweetsController.post.addOne)
router.post("/many", tweetsController.post.addMany)

export { router as tweetsRouter }