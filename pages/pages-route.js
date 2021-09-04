import { Router } from "express"
import auth from "../middleware/auth.js"
import checkLogin from "../middleware/check-login.js"
import updateLastPageview from "../middleware/update-last-pv.js"
import pagesController from "./pages-controller.js"

const router = Router()

router.get("/", checkLogin, pagesController.renderHome)
router.get("/account/:id", auth, pagesController.renderAccount)
router.get("/tweet/", updateLastPageview, pagesController.renderDate)
router.get("/tweet/:id", pagesController.renderTweet)
router.get("/search", pagesController.renderSearch)
router.get("/login", pagesController.renderLogin)
router.get("*", pagesController.renderError)

export { router as pagesRouter }