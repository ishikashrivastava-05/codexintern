import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json()) 
app.use(express.urlencoded()) 
app.use(express.static("public/temp"))

app.use(cors({ origin: process.env.CORS_ORIGIN}))
app.use(cookieParser())



import employeerRouter from "./routes/employeer.router.js"
import jobSeekerRouter from "./routes/jobSeeker.router.js"
import jobsRouter from "./routes/jobs.router.js"
import applicantsRouter from "./routes/applicants.router.js"


app.use("/api/v1/employeer", employeerRouter);
app.use("/api/v1/jobseeker", jobSeekerRouter);
app.use("/api/v1/jobs", jobsRouter);
app.use("/api/v1/applicants", applicantsRouter)




export default app