import { Router } from "express"
import adminController from "./admin-controller.js"

const router = Router()

router.get("/user", adminController.checkUser)

router.post("/signup", adminController.signup)
router.post("/login", adminController.login)
router.post("/logout", adminController.logout)
router.post("/delete", adminController.delete)
router.post("/reset", adminController.reset)

export { router as adminRouter }