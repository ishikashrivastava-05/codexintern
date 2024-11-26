import Handleres from "../utils/Handleres.js";
import ErrorHandle from "../utils/ErrorHandle.js";
import mongoose from "mongoose";

import Jobs from "../models/jobs.model.js";
import { deleteAccount } from "./employer.controller.js";
const createJob = async(req,res)=>{
        /*
    1. take all required fields
    2. sanitize them properly
    3. create a job post by creating a new document for that job
    4. return response along with the job post
    */

    const {title,experience,salary,job_location,description,vacancy,date_of_post,comapny_deatils }= req.body
    if( !title || !experience ||!salary || !job_location || !description || !vacancy || !date_of_post || !comapny_deatils){
         return res.status(400).json(new ErrorHandle(400, "All fields are required"))
    }
    
    if(title.trim() === ""){
        return res.status(400).json(new ErrorHandle(400,"Title is  not valid"))
    }
    if(experience.trim()===""){
        return res.status(400).json( new ErrorHandle(400," experience is not valid"))
    }
    if(salary<= 0){
        return res.status(400).json( new ErrorHandle(400,"salary is not valid"))
    }
    if(job_location.trim()===""){
        return res.status(400).json( new ErrorHandle(400," joblocation is not valid"))
    }
    if(description.trim()===""){
        return res.status(400).json( new ErrorHandle(400,"description is not valid"))
    }
    if(vacancy<= 0){
        return res.status(400).json( new ErrorHandle(400,"vacancy is not valid"))
    } 
    if(comapny_deatils .trim()===""){
        return res.status(400).json( new ErrorHandle(400,"vacancy is not valid"))
    }
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // DD-MM-YYYY format
    if (!dateRegex.test(date_of_post)) {
        return res.status(400).json(new ErrorHandle(400, "Date of post is not valid"));
    }
    const CreateJob = await Jobs.create({
      
      title:title,
      experience:experience,
      salary:salary,
      job_location:job_location,
      vacancy:vacancy,
      date_of_post:date_of_post,
      comapny_deatils:comapny_deatils,
      description:description
    })
    console.log(CreateJob)
    return res.status(200).json(new Handleres(200,"Create job succesfully",console.log(createJob))
    )
}


const listAlljobs=async(req,res)=>{
const jobs = await Jobs.find();
if(!jobs){
    return res.status(500).json(new ErrorHandle(500,"Internal Server Error"))
}
if(jobs.length === 0){
    return res.status(400).json(new ErrorHandle(400,"no job"))
}
return res.status(200).json(200,jobs,"Jobs Retrieved Successfully"), console.log(jobs)}

const getJobById= async(req,res)=>{
    const {id}=req.params;
    console.log(id)
    if(!mongoose.Types.ObjectId.isValid(id)){
         return res.status(400).json(new ErrorHandle(400, "Invalid id"))
    }
    const job = await Jobs.findById(id)
    console.log(job)
    if (!job) {
        return res.status(400).json(new ErrorHandle(400, "Job not found"));
    }
    return res.status(200).json(new Handleres(200,"job retried successfully",console.log(job)))
}

const deleteJobById = async (req, res) => {
   const {id}=req.params;
   console.log(id)
   if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json(400,"Inaavalid Object Id ")
   }
   const deleteJob = await Jobs.findByIdAndDelete(id)
   if(!deleteJob){
    return res.status(400).json(400,"job not found")
   }
   return res.status(200).json(200,"delete job succesfully", console.log(deleteJob,"delete successfully"))
}



export {
    createJob, listAlljobs,getJobById,deleteJobById
}