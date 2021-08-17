import express from "express"
import auth from "../../middleware/auth.js"
import checkLogin from "../../middleware/check-login.js"
import pagesController from "../../controllers/pages.js"

const router = express.Router()

router.get("/", checkLogin, pagesController.renderHome)
router.get("/account/:id", auth, pagesController.renderAccount)
router.get("/search", pagesController.renderSearch)
router.get("/login", pagesController.renderLogin)
router.get("*", pagesController.renderError)

export { router as pagesRouter }