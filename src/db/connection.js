import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const dbconnection=async()=>{
    try {
        const conn=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log("database connected !! DB_HOST : ",conn.connection.host)
    } catch (error) {
        console.log("error in db connection",error)
        process.exit(1)
    }
}
export default dbconnection