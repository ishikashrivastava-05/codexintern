import ErrorHandle from "../utils/ErrorHandle.js";
import Handleres from "../utils/Handleres.js";
import jwt from "jsonwebtoken"
import Employee from "../models/employer.model.js";
import jobSeeker from "../models/jobSeeker.model.js";

const jobSeekerAuth = async (req,res,next)=>{
    try{
        const token = req.cookies?.accessToken
        if(!token){
            return res.status(400).json(
                new ErrorHandle(400,"Token Expired")
            )
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
         const jobseekerData = await jobSeeker.findById(decodedToken._id).select("-password");
          if(!jobseekerData){
            return res.status(400).json(
                new ErrorHandle(400,"invalid token")
            )
          }
          req.jobseeker=jobseekerData;
          next();
    }catch(error){
        return res.status(400).json(new ErrorHandle(400, error?.message))
    }
}
export default jobSeekerAuth;