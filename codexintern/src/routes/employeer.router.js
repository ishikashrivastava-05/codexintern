import {Router} from "express"
import {signup,login,logout,currentEmployee,deleteAccount} from "../controllers/employer.controller.js"
import empAuth from "../middleware/empAuth.middleware.js"
const router = Router()
router.route("/signup").post(signup)
router.route("/login").post(login)

router.route("/logout").get(empAuth, logout)
router.route("/current-employee").get(empAuth, currentEmployee)
router.route("/delete").delete(empAuth,deleteAccount)
export default router