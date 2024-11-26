import ErrorHandle from "../utils/ErrorHandle.js"
import Handleres from "../utils/Handleres.js"
import Employee from "../models/employer.model.js"
import bcrypt from "bcrypt"

const signup = async (req,res)=>{
const {name, email, phone_no, address, status, password}=req.body
if(!name || !email || !phone_no || !address || !status || !password ){
    return res.status(400).json(new ErrorHandle(400,"All fields are required"))
}
if (name.trim() === ""){
    return res
    .status(400)
    .json(
        new ErrorHandle(400,"Name should not be Empty")
    )
}
if (!/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email.trim())) { 
    return res
    .status(400)
    .json(
        new ErrorHandle(400, "Invalid E-Mail!!")
        )
    }
if (String(phone_no).length !== 10){
    return res
    .status(400)
    .json(
        new ErrorHandle(400, "Phone number must be 10 digits  ")
    )
}
if(address.trim() === " "){
    return res
    .status(400)
    .json(
        new ErrorHandle(400, "Address should not be empty")
    )
}
if(status.trim() === ""){
    return res
    .status(400)
    .json(new ErrorHandle(400, "Status should not be empty!"))
}
if(status !== "company" && status !== "individual"){
    return res
    .status(400)
    .json(
        new ErrorHandle(400, "Status should be either company or individual!")
    ) 
}
if (password.trim()?.length < 8 || password.trim()?.length > 16){
    return res
    .status(400)
    .json(
        new ErrorHandle(400, "Password should be 8 to 16 digits long!")
    )
}
const isExistedEmploye =await Employee.findOne({ $or:[{email},{phone_no}]})
if(isExistedEmploye){
    return res
        .status(400)
        .json(
            new ErrorHandle(400, "Already have an account! Please go for signin!!")
        ) 
}
const employer = await Employee.create(
    {
        name:name,
        email:email,
        phone_no:phone_no,
        address:address,
        status:status,
        password:password
    }
)
const createdEmployer = await Employee.findById(employer._id).select("-password")
if (!createdEmployer) {
    return res
    .status(500)
    .json(
        new ErrorHandle(500, "Something went wrong while creating employer's account!")
    )
}
return res
.status(201)
.json(
    new Handleres(200, createdEmployer, "Account created successfully!")
)
}

const login = async(req,res)=>{
 const {email,password} =req.body
 if(!email || !password){
    return res.status(400).json(new ErrorHandle (400,"All Fields Are required"))
 } 
 if(email.trim() ===""){
    return res
    .status(400)
    .json(
        new ErrorHandle(400, "Email is required!!")
    )
 } 
 if(password.trim()?.length< 8 || password.trim()?.length >16){
    return res
    .status(400)
    .json(
        new ErrorHandle(400, "Password must be 8 to 16 digits long!")
    )
 }  
 const employeeData = await Employee.findOne({email:email.trim()})
 if(!employeeData){
    return res
    .status(400)
    .json(
        new ErrorHandle(400, "Account not exists! Please create an account!")
    )
 }
 const isCorrectPassword = await employeeData.comparePassword(password,employeeData.password)
 if(!isCorrectPassword){
    return res
    .status(400)
    .json(
        new ErrorHandle(400, "Invalid password!")
    )
 }
 const accessToken = employeeData.generateAccessToken()
 const options = {
    httpOnly:true,
    secure:true
 }
 return res
 .status(200)
 .cookie("accessToken" ,accessToken,options)
 .json(
    new Handleres(200,{},"Login Successfully!")
 )
}
const logout = async (req, res) => {
    if (!req?.employeer) {
        return res
        .status(400)
        .json(
            new ErrorHandle(400, "You haven't logged in yet!")
        )
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(
        new Handleres(200, {}, "Logged out successfully!")
    )
}
const currentEmployee = async (req, res) => {
    return res
    .status(200)
    .json(
        new Handleres(200, req?.employeer, "Current employeer fetched successfully!")
    )
}

const updateDetails = async (req, res) => {
    const { name, email, phone_no, website } = req.body

    if (!name && !email && !phone_no && !website && !password) {
        return res
        .status(400)
        .json(
            new ErrorHandle(400, "You have to provide at least 1 field!")
        )
    }

    if (name && name.trim() === "") {
        return res
        .status(400)
        .json(
            new ErrorHandle(400, "Name should not be empty!")
        )
    }

    if (email && !/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email?.trim())) {
        return res
        .status(400)
        .json(
            new ErrorHandle(400, "Invalid E-Mail")
        )
    }

    if (phone_no && phone_no?.trim()?.length !== 10) {
        return res
        .status(400)
        .json(
            new ErrorHandle(400, "Invalid Phone Number!")
        )
    }

    if (website && !/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(website?.trim())) {
        return res
        .status(400)
        .json(
            new ErrorHandle(400, "Invalid Website URL")
        )
    }

    if (password && (password?.trim()?.length < 8 ||  password?.trim()?.length > 16)) {
        return res
        .status(400)
        .json(
            new ErrorHandle(400, "Invalid password length!")
        )
    }
    const employeerData = await Employee.findById(req.employeer._id)

    employeerData.name = name?.trim() === "" ? employeerData.name : name?.trim()
    employeerData.email = email?.trim() === "" ? employeerData.email : email?.trim()
    employeerData.phone_no = phone_no?.trim() === "" ? employeerData.phone_no : phone_no?.trim()
    employeerData.website = website?.trim() === "" ? employeerData.website : website?.trim()
    await employeerData.save({ validateBeforeSave: false })

    const updatedData = await Employee.findById(req.employeer._id)

    return res
    .status(200)
    .json(
        new Handleres(
            200,
            updatedData,
            "Details updated successfully!"
        )
    )
   
}
const updatePassword = async (req, res) => {
    const {password} = req.body

    if (!password) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password required!")
        )
    }

    if (password?.trim() === "") {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password should not be empty!")
        )
    }
    if (password?.trim().length < 8 || password?.trim().length > 16) {
        return res
        .status(400)
        .json(
            new HandleError(400, "Password should be 8 to 16 digits long!")
        )
    }

    const encryptedPassword = await bcrypt.hash(password?.trim(), 10)

    const data = await Employee.findByIdAndUpdate(
        req.employeer._id,
        {
            $set: {
                password: encryptedPassword
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new Handleres(200, data, "Password updated successfully!")
    )
 }


 const deleteAccount = async(req,res)=>{
    const employeeId = req.employeer._id;
    if(!employeeId){
        return res.status(400).json(
            new ErrorHandle(400,"Invalid employee id")
        )
    }
    const deletedEmploye= await Employee.findByIdAndDelete(employeeId)
    if(!deletedEmploye){
        return res.status(404).json(
            new ErrorHandle(404, "Employer not found!")
        );
    }
    return res.status(200).json(
        new Handleres(200,{} ,"Account Deleted successfully")
    )
 }
export  {
    signup,
    login,
    logout,
    currentEmployee,
    updateDetails,updatePassword,deleteAccount
}