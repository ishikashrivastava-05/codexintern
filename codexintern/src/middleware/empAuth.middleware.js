import ErrorHandle from "../utils/ErrorHandle.js";
import Handleres from "../utils/Handleres.js";
import jwt from "jsonwebtoken"
import Employee from "../models/employer.model.js";

const empAuth = async (req,res,next)=>{
    try{
        const token = req.cookies?.accessToken
        if(!token){
            return res
            .status(400)
            .json(
                new ErrorHandle(400, "Token expired!!")
            )  
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const employeeData= await Employee.findById(decodedToken._id).select("-password")
        if(!employeeData){
            return res
            .status(400)
            .json(
                new ErrorHandle(400, "Invalid Token!")
            )
        }
        req.employeer = employeeData
        next()
    }catch(error){
        return res
            .status(400)
            .json(
                new ErrorHandle(400, error?.message)
            )
    }
    
}
export default empAuth