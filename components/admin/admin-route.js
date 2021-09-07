import { Router } from "express"
import adminController from "./admin-controller.js"
import setCookie from "../../middleware/set-cookie.js"

const router = Router()

router.post("/login", setCookie, adminController.login)
router.post("/logout", adminController.logout)

export { router as adminRouter }