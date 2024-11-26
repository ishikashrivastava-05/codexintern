import mongoose from 'mongoose'
import DBname from '../constant.js'

const connectDb =async()=>{
try{
const response = await mongoose.connect(`${process.env.MONGODB_URL}/${DBname}`)
console.log(`mongodb connected :: ${response.connection.host}`)
}catch(error){
console.log(error)
}
}
export default connectDb