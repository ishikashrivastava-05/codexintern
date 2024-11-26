import {Router} from "express";
import  {applyToJob} from "../controllers/applicants.controller.js"
const router = Router()

router.route('/apply').post(applyToJob)
export default router 