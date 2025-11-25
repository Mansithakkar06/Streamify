import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getChannelStats=asyncHandler(async(req,res)=>{

})

const getChannelVideos=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400,"invalid id!!")
    }
    const channel=await User.findById(id)
    if(!channel){
        throw new ApiError(404,"channel not found!!")
    }
    const videos=await Video.find({owner:id})
    if(!videos.length){
        throw new ApiError(200,"no videos yet")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,videos,"channel videos fetched successfully")
    )
})

export {
    getChannelStats,
    getChannelVideos
}