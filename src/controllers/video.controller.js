import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {Video} from "../models/video.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const getAllVideos=asyncHandler(async(req,res)=>{

})

const publishVideo= asyncHandler(async(req,res)=>{
    //collect text data 
    const {title,description}=req.body;
    //validate for null values
    if(!(title || description)){
        throw new ApiError(400,"All fields required!!")
    }
    //collect files
    const thumbnailLocalPath=req.files?.thumbnail?.[0]?.path;
    if(!thumbnailLocalPath){
        throw new ApiError(400,"Thumbnail is required!!")
    }
    const videoLocalPath=req.files?.videoFile?.[0]?.path;
    if(!videoLocalPath){
        throw new ApiError(400,"Video file is required!!") 
    }   
    //upload files to cloudinary
    const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)
    const videoFile=await uploadOnCloudinary(videoLocalPath)
    //check if uploaded or not
    if(!thumbnail){
        throw new ApiError("thumbnail is missing!!")
    }
    if(!videoFile){
        throw new ApiError("videoFile is missing!!")
    }
   //create document in database
    const video=await Video.create({
        title,
        description,
        thumbnail:{
            url:thumbnail.url,
            public_id:thumbnail.public_id
        },
        videoFile:{
            url:videoFile.url,
            public_id:videoFile.public_id
        },
        duration:videoFile.duration,
        owner:new mongoose.Types.ObjectId(req.user._id)
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"Video uploaded successfully")
    )

})

const getVideoById=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400,"Invalid id!!")
    }
    const video=await Video.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"user"
            }
        },
        {
            $unwind:"$user"
        },
        {
            $project:{
                videoFile:1,
                thumbnail:1,
                title:1,
                description:1,
                duration:1,
                views:1,
                owner:"$user.username"
            }
        }
    ])
    return res
    .status(200)
    .json(
        new ApiResponse(200,video[0],"Video fetched successfully")
    )
})

const updateVideoDetails=asyncHandler(async(req,res)=>{
    const {title,description}=req.body;
})

export {
    publishVideo,
    getVideoById,
    updateVideoDetails,
}