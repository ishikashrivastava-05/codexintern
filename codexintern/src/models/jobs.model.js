import mongoose,{Schema} from "mongoose";
const jobSchema=new Schema({
title:{
 type:String,
 required:true
},
experience:{
    type:Number,
    required:true
},
// skills:[{ type:String}],
salary:{
    type:Number,
 required:true
},

job_location:{
    type:String,
    enum:["remote","hybrid","onsite"]
},
description:{
    type:String,
    required:true
},
vacancy:{
    type:Number,
    required:true
},
date_of_post:{
    type:Date,
    required:true
},
comapny_deatils:{
    type:String,
    required:true
}
})
const Jobs = mongoose.model("Jobs",jobSchema)
export default Jobs