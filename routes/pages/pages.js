import express from "express"
import pagesController from "../../controllers/pages.js"

const router = express.Router()

router.get("/", pagesController.renderHome)
router.get("/account/:id", pagesController.renderAccount)
router.get("/search", pagesController.renderSearch)
router.get("/login", pagesController.renderLogin)
router.get("*", pagesController.renderError)

export { router as pagesRouter }