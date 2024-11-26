import Handleres from "../utils/Handleres.js";
import ErrorHandle from "../utils/ErrorHandle.js";
import JobSeeker from "../models/jobSeeker.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import bcrypt from "bcrypt"




const signup = async (req, res) => {
    const { name, email, phone_no, gender, education, experience, location, password,resume } = req.body
    if (!name || !email || !phone_no || !gender || !education || !experience || !location || !password || !resume ) {
        return res.status(400).json(new ErrorHandle(400, "All fields are required"))
    }
    if (name.trim() === "") {
        return res
            .status(400).json(new ErrorHandle(400, "Name should not be empty!!"))
    }
    if (!/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email.trim())) {
        return res
            .status(400)
            .json(
                new HandleError(400, "Invalid E-Mail!!")
            )
    }
    if (String(phone_no).length !== 10) {
        return res.status(400).json(new ErrorHandle(400, "Phone number must be 10 digits long!!"))
    }
    if (location.trim() === "") {
        return res.status(400).json(new ErrorHandle(400, "location should not be empty"))
    }
    if (education.trim() === "") {
        return res.status(400).json(new ErrorHandle(400, "education should not be empty"))
    }
    if (experience.trim() === "") {
        return res.status(400).json(new ErrorHandle(400, "experience should not be empty"))
    }
    if (gender === "male" && gender === "female" && gender === "others") {
        return res.status(400).json(new ErrorHandle(400, "Gender should be either male, female, or other"))
    }
    if (password.trim()?.length < 8 || password.trim()?.length > 128) {
        return res.status(400).json(new ErrorHandle(400, "Password should be 8 to 16 characters long!"))
    }
    let resumeUrl = null;
    if (req.file) {
        const resume = req.file;
        console.log(resume);
        const response = await uploadOnCloudinary(resume.path);
        console.log(response);
        if (!response) {
            return res.status(500).json(new ErrorHandle(500, "Something went wrong while uploading resume!"));
        }
        resumeUrl = response.secure_url;
    } else {
        return res.status(400).json(new ErrorHandle(400, "Resume file is required"));
    }
    const isExistedJobseeker = await JobSeeker.findOne({ $or: [{ email }, { phone_no }] })
    if (isExistedJobseeker) {
        return res.status(400).json(new ErrorHandle(400, "Already have an account! Please go for signin!!"));
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const jobseeker = await JobSeeker.create({
        name: name,
        email: email,
        phone_no: Number(phone_no),
        gender: gender,
        education: education,
        experience: experience,
        location: location,
        password: hashedPassword,
        resume: resumeUrl
    })
    console.log(jobseeker)
    const isCreated = await JobSeeker.findById(jobseeker?._id).select("-password")

    if (!isCreated) {
        return res
            .status(500)
            .json(
                new HandleError(500, "Something went wrong while creating account!")
            )
    }

    return res
        .status(200)
        .json(
            new Handleres(200, isCreated, "Profile created successfully!")
        )
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json(new ErrorHandle(400, "All Fields Are required"))
    }
    if (email.trim() === "") {
        return res.status(400).json(
            new ErrorHandle(400, "Email is not valid")
        )
    }
    if (password.trim()?.length < 8 || password.trim()?.length > 128) {
        return res.status(400).json(
            new ErrorHandle(400, "Password is must be 8 or 16 digits")
        )
    }
    const jobseekerData = await jobSeeker.findOne({ email: email.trim() })
    if (!jobseekerData) {
        return res
            .status(400)
            .json(
                new ErrorHandle(400, "Account not exists! Please create an account!")
            )
    }
    const isCorrectPassword = await jobseekerData.comparePassword(password, jobseekerData.password)
    if (!isCorrectPassword) {
        return res
            .status(400)
            .json(
                new ErrorHandle(400, "Invalid password!")
            )
    }
    const accessToken = jobseekerData.generateAccessToken()
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new Handleres(200, {}, "Login Successfully!")
        )
}

const logout= async(req,res)=>{
  if(!req?.jobseeker){
    return res
        .status(400)
        .json(
            new ErrorHandle(400, "You haven't logged in yet!")
        )
  }
  const options={
    httpOnly:true,
    secure:true
  }
  return res.status(200).clearCookie("accessToken",options)
  .json(
    new Handleres(200,{}, "logged out successfully")
  )
}

const currentJobseeker = async(req,res)=>{
  return res.status(200).json(
    new Handleres(200, req?.jobseeker,"current jobseeker")
    
) 
}

const updateName = async (req, res) => {
    /*
    1. take new name from the frontend */
    const {name} =req.body

    if(!name || name.trim === ""){
       return res .status(400).json(new ErrorHandle(400,"name should be empty"))
    }
   /* 2. take _id from authentication*/
   const jobseekerId = req.jobseeker._id
    // 3. update the name in the database

    const jobseekerData = await jobSeeker.findById(jobseekerId);
    // 4. return response
    if(!jobseekerData){
        return res.status(400).json(new ErrorHandle(400,"jobseeker not found"))
    }
    jobseekerData.name = name.trim()
    const updateData = await jobseekerData.save({validateBeforeSave:false})
     if(updateData)
{
    return res.status(200).json(new Handleres(200, "rname is updated"))
}else{
    return res.status(500).json(new ErrorHandle(500,"Failed to update"))
}}


console.log(currentJobseeker) 


const updateEmail = async (req, res) => {
   const {email}= req.body;
   if(!email){
    return res.status(400).json(new ErrorHandle(400,"email is not valid"))
   }
  
   const jobseekerId = req.jobseeker._id
   const updatedJobseeker = await jobSeeker.findByIdAndUpdate(
    jobseekerId,{email:email},{new:true}
   );
   if(!updatedJobseeker){
    return res.status(400).json(400,"jobseeker is not found")
   }
   return res.status(200).json(200,"congrats email succesfully updated")
}
const updatePhoneNo = async (req, res) => {
    const {phone_no}=req.body
    if(!phone_no){
        return res.status(400).json(400,"email is not found")
    }
    const jobseekerId = req.jobseeker._id
    const updatedJobseeker = await jobSeeker.findByIdAndUpdate(
        jobseekerId,{phone_no:phone_no},{new:true}
       );
       if(!updatedJobseeker){
        return res.status(400).json(400,"jobseeker is not found")
       }
       return res.status(200).json(200,"congrats Phoneno is succesfully updated")
    }

    const updateEducation = async (req, res) => {
        const {education}=req.body
        if(!education){
            return res.status(400).json(400,"email is not found")
        }
        const jobseekerId = req.jobseeker._id
        const updatedJobseeker = await jobSeeker.findByIdAndUpdate(
            jobseekerId,{education:education},{new:true}
           );
           if(!updatedJobseeker){
            return res.status(400).json(400,"jobseeker is not found")
           }
           return res.status(200).json(200,"congrats education is succesfully updated") 
    }
  

    const updateLocation = async (req, res) => {
        const {location}=req.body
        if(!location){
            return res.status(400).json(400,"email is not found")
        }
        const jobseekerId = req.jobseeker._id
        const updatedJobseeker = await jobSeeker.findByIdAndUpdate(
            jobseekerId,{location:location},{new:true}
           );
           if(!updatedJobseeker){
            return res.status(400).json(400,"jobseeker is not found")
           }
           return res.status(200).json(200,"congrats location is succesfully updated")
    }
    const updateSkills = async (req, res) => {
        const {skills}=req.body
        if(!skills){
            return res.status(400).json(400,"email is not found")
        }
        const jobseekerId = req.jobseeker._id
        const updatedJobseeker = await jobSeeker.findByIdAndUpdate(
            jobseekerId,{skills:skills},{new:true}
           );
           if(!updatedJobseeker){
            return res.status(400).json(400,"jobseeker is not found")
           }
           return res.status(200).json(200,"congrats skills is succesfully updated");
          
    }
    
    const updatePassword = async (req, res) => {
        const {password}=req.body
        if(!password){
            return res.status(400).json(400,"email is not found")
        }
        const jobseekerId = req.jobseeker._id
        const updatedJobseeker = await jobSeeker.findByIdAndUpdate(
            jobseekerId,{password:password},{new:true}
           );
           if(!updatedJobseeker){
            return res.status(400).json(400,"jobseeker is not found")
           }
           return res.status(200).json(200,"congrats password is succesfully updated");
    }
  

    const deleteAccount = async (req, res) => {
        
       
        const jobseekerId = req.jobseeker._id
        if(!jobseekerId){
            return res.status(400).json(400,"jobseeker is not valid")
        }
        const deleteJobseeker = await jobSeeker.findByIdAndDelete(
            jobseekerId
           );
           if(!deleteJobseeker){
            return res.status(400).json(400,"jobseeker is not found")
           }
           return res.status(200).json(200,"delete ur id");
    }
    
export {
    signup,login, logout, currentJobseeker, updateName, updateEmail,updatePhoneNo,updateEducation,updateLocation,updateSkills,updatePassword, deleteAccount
}