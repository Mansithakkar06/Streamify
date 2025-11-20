import { asyncHandler } from "../utils/asyncHandler.js";
import {Comment} from '../models/comment.model.js'
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addComment=asyncHandler(async (req,res) => {
    const {videoId}=req.params;
    const {content}=req.body;
    //validation
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"invalid id!!")
    }
    if(!content){
        throw new ApiError(400,"content is required!!")
    }
    //add comment
    const comment=await Comment.create({
        video:new mongoose.Types.ObjectId(videoId),
        content:content,
        owner:new mongoose.Types.ObjectId(req.user?._id)
    })
    if(!comment){
        throw new ApiError(500,"error in creating comment!!")
    }
    res.status(200)
    .json(
        new ApiResponse(200,comment,"comment created successfully")
    )

})

const updateComment=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400,"invalid id!!")
    }
    const {content}=req.body;
    if(!content){
        throw new ApiError(400,"content is required!!")
    }
    const comment=await Comment.findByIdAndUpdate(id,
        {
            $set:{
                content:content
            }
        },
        {new:true}
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200,comment,"comment updated successfully")
    )
})

const deleteComment=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        throw new ApiError(400,"invalid id!!")
    }
    const deletedComment=await Comment.findByIdAndDelete(id)
    if(!deletedComment){
        throw new ApiError("error in deleting comment!!")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,deletedComment,"comment deleted successfully")
    )

})

const getVideoComments=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
     if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"invalid id!!")
    }
    const comments=await Comment.find({video:new mongoose.Types.ObjectId(videoId)})
    if(!comments.length){
        throw new ApiError(400,"no comments yet!!")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,comments,"comments fetched successfully")
    )
})

export {
    addComment,
    updateComment,
    deleteComment,
    getVideoComments
}