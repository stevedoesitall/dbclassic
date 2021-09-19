import { Router } from "express"
import redirect from "../../middleware/redirect.js"
import updateLastPageview from "../../middleware/update-last-pv.js"
import verifySignup from "../../middleware/verify-signup.js"
import pagesController from "./pages-controller.js"

const router = Router()

router.get("/", pagesController.renderHome)
router.get("/account", redirect, pagesController.renderAccount)
router.get("/tweet/", updateLastPageview, pagesController.renderDate)
router.get("/tweet/:id", pagesController.renderTweet)
router.get("/search", pagesController.renderSearch)
router.get("/login", redirect, pagesController.renderLogin)
router.get("/signup", redirect, pagesController.renderSignup)
router.get("/verify/:id", verifySignup, pagesController.renderVerify)
router.get("*", pagesController.renderError)

export { router as pagesRouter }