import dotenv from 'dotenv'
import dbconnection from './db/connection.js';
import { app } from './app.js';

dotenv.config({
    path:"./.env"
})
dbconnection()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log("server is listening on port: ",process.env.PORT)
    })
})
.catch((error)=>{
    console.log("ERROR: CONNECTION TO DATABASE FAILLED!!",error)
})
