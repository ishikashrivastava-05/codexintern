import app from './app.js'
import connectDb from "./database/db.js";
import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
connectDb()
.then(() => {
    console.log(`MongoDB Connected !!!`)

    app.listen(process.env.PORT, () => {
        console.log(`Server started on port ${process.env.PORT}`);
      });
      
})
.catch((error) => {
    console.log(error?.message)
})