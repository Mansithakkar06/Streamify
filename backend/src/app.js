import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,//allows requests from this origin
    credentials:true //allow cookies and jwt token to be sent
}))

app.use(express.json({limit:"20kb"})) //to parse json body with size limit
app.use(express.urlencoded({extended:true,limit:"20kb"})) //to parse urlencoded body with size limit
app.use(express.static("public")) //to make public folder available to browser for all
app.use(cookieParser()) //to allow express to access cookies

//routes
import userRouter from './routes/user.routes.js'
import videoRouter from "./routes/video.routes.js"
import likeRouter from "./routes/like.routes.js"
import commentRouter from './routes/comment.routes.js'
import playListRouter from './routes/playlist.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'

app.use("/api/v1/users",userRouter) //so that we dont have to write full path all the times
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/likes",likeRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/playLists",playListRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/dashboard",dashboardRouter)

export {app}