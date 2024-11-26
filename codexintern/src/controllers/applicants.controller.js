import ErrorHandle from "../utils/ErrorHandle.js"
import Handleres from '../utils/Handleres.js'
import Applicants from "../models/applicants.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import Applicant from "../models/applicants.model.js"

const applyToJob = async (req, res) => {
    /*
    1. take all necessary parameters   {aaplicant_name, phone_no, email, resume,job_id} */
       const {applicant_name,applicant_id,phone_no,email,resume,job_id}= req.body
    /* 2. sanitize them properly */
  if(!applicant_name|| !applicant_id || !phone_no ||!email || !resume || job_id){
    return res.status(400).json(new ErrorHandle(400,"all fields are required"))
  } 
  if(applicant_name.trim() === ""){
    return res.status(400).json(new ErrorHandle(400,"applicants is not correct"))
  }
  if(String(phone_no).length !== 10){
    return res.status(400).json(new ErrorHandle(400,"phone no not correct"))
  }
  if(!/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email.trim())){
     return res.status(400).json(new ErrorHandle(400,"email are required"))
  }
  if(!req.file){
    return res.status(400).json(new ErrorHandle(400, "Resume file is required"));
  }
  if (!mongoose.Types.ObjectId.isValid(job_id)) {
    return res.status(400).json(new ErrorHandle(400, "Invalid job ID"));
  }
    const existingApplicants = await Applicants.findOne({email,job_id});
    if(existingApplicants){
        return res.status(400).json(new ErrorHandle(400,"You have not applicant"))
    }

    const resumeUploadres =await uploadOnCloudinary(req.file.path)
    if(resumeUploadres?.error){
      return res.status(500).json(new ErrorHandle(500,"Error Upload resume"))
    }

    const newApplication =await Applicant.create({
        applicant_name: applicant_name,
        applicant_id:applicant_id,
        phone_no:phone_no,
        email:email,
        resume:resumeUploadres.secure_url,
        job_id:job_id
    })
    await newApplication.save()
    return res.status(200).json(new Handleres(200,"aapply is completed"))
  /* 3. check applicant_id is present or not in the database*/
   /* 4. If present, just throw an error  */
   /* 5. If not, create a new job application */
   /* 6. Save the application in the database */
   /* 7. Return a response with success message */
   
  

}
export {
    applyToJob
}