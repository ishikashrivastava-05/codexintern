import {Router} from "express";
import {createJob,getJobById,listAlljobs,deleteJobById} from "../controllers/job.controller.js";

const router = Router()
router.route("/createdBy").post(createJob)
router.route("/listAll").get(listAlljobs)
router.route("/getjob/:id").get(getJobById)
router.route("/delete/:id").delete(deleteJobById)
export default router 