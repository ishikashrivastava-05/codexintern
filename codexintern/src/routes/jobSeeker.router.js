import { Router } from "express"
import {login, signup, logout,currentJobseeker, updateName, updateEmail,updatePhoneNo,updateEducation, updateLocation, updateSkills, updatePassword, deleteAccount} from "../controllers/jobseeker.controller.js"
import upload from "../middleware/multer.middleware.js"
import jobSeekerAuth from "../middleware/jobSeekerAuth.middleware.js"
import jobSeeker from "../models/jobSeeker.model.js"
const router = Router()


router.route("/signup").post(upload.single("resume"),signup)
router.route("/login").post(login)

router.route("/logout").get(jobSeekerAuth,logout)
router.route("/currentJobseeker").get(jobSeekerAuth, currentJobseeker)
router.route("/update-name").patch(jobSeekerAuth,updateName)
router.route("/update-email").patch(jobSeekerAuth,updateEmail)
router.route("/update-phone_no").patch(jobSeekerAuth,updatePhoneNo)
router.route("/update-education").patch(jobSeekerAuth,updateEducation)
router.route("/update-location").patch(jobSeekerAuth,updateLocation)
router.route("/update-skills").patch(jobSeekerAuth,updateSkills)
router.route("/update-password").patch(jobSeekerAuth,updatePassword)
router.route("/delete").delete(jobSeekerAuth,deleteAccount)
export default router