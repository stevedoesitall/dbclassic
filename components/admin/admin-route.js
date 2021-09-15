import { Router } from "express"
import adminController from "./admin-controller.js"

const router = Router()

router.post("/login", adminController.login)
router.post("/logout", adminController.logout)

export { router as adminRouter }