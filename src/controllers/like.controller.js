import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from '../models/like.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import { json } from "express";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "invalid id!!")
    }
    //take reaction type
    const { reactionType } = req.body
    //check for the existing data 
    const existingLike = await Like.findOne({ video: id }, { likeBy: req.user?.id })

    //if reaction type is null then delete that record
    if (!reactionType) {
        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id)
        }
        return res.status(200).json(new ApiResponse(200, "reaction removed successfully"))
    }
    //if like/dislike then
    //if data is there update it
    if (existingLike) {
        existingLike.reaction = reactionType
        await existingLike.save({ validateBeforeSave: false })
        return res.status(200).json(new ApiResponse(200, existingLike, "reaction updated successfully"))
    }
    //else create new data
    const like = await Like.create({
        video: id,
        reaction: reactionType,
        likedBy: req.user?._id
    })
    return res
        .status(200)
        .json(
            new ApiResponse(200, like, "reaction created successfully")
        )

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "invalid id!!")
    }
    //take reaction type
    const { reactionType } = req.body
    //check for the existing data 
    const existingComment = await Like.findOne({ comment: id }, { likeBy: req.user?.id })

    //if reaction type is null then delete that record
    if (!reactionType) {
        if (existingComment) {
            await Like.findByIdAndDelete(existingComment._id)
        }
        return res.status(200).json(new ApiResponse(200, "reaction removed successfully"))
    }
    //if like/dislike then
    //if data is there update it
    if (existingComment) {
        existingComment.reaction = reactionType
        await existingComment.save({ validateBeforeSave: false })
        return res.status(200).json(new ApiResponse(200, existingComment, "reaction updated successfully"))
    }
    //else create new data
    const comment = await Like.create({
        comment: id,
        reaction: reactionType,
        likedBy: req.user?._id
    })
    return res
        .status(200)
        .json(
            new ApiResponse(200, comment, "reaction created successfully")
        )
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //get video details
    const videos = await Like.find({ likedBy: req.user?._id }, { reaction: "like" })
    if (!videos.length) {
        return res.status(200).json(new ApiResponse(200, "No liked videos yet!!"))
    }
    res.status(200).json(
        new ApiResponse(200, videos, "Videos liked by you")
    )
})

export {
    toggleVideoLike,
    toggleCommentLike,
    getLikedVideos
}