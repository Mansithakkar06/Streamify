import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
    //Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const id = req.user?._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "invalid id!!")
    }
    const totalVideos=await Video.countDocuments({owner:id})
    const Subscriberscount=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(id)
            },
        },
        {
            $lookup:{
                from:"subscribers",
                localField:"channel",
                foreignField:"_id",
                as:"subscribers"
            }
        },
        {
            $addFields:{
                subscribers:{
                    $size:"$subscribers"
                }
            }
        },
        {
            $project:{
                subscribers:1
            }
        }
    ])
    const totalSubscribers = Subscriberscount[0]?.subscribers || 0;
    const viewsCount=await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(id)
            }
        },
        {
            $group:{
                _id:null,
                totalViews:{
                    $sum:"$views"
                }
            }
        }
    ])
    const totalViews=viewsCount[0]?.totalViews || 0;
    const likesCount=await Like.aggregate([
        {
            $match:{
                reaction:"like"
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"videoData"
            }
        },
        {
            $match:{
                "videoData.owner":new mongoose.Types.ObjectId(id)
            }
        },
        {
            $count:"totalLikes"
        },
        
    ])
    const totalLikes=likesCount[0]?.totalLikes||0;
    return res.status(200).json(
        new ApiResponse(200,{
            totalLikes:totalLikes,
            totalSubscribers:totalSubscribers,
            totalVideos:totalVideos,
            totalViews:totalViews
        })
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const id = req.user?._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "invalid id!!")
    }
    const channel = await User.findById(id)
    if (!channel) {
        throw new ApiError(404, "channel not found!!")
    }
    const videos = await Video.find({ owner: id })
    if (!videos.length) {
        throw new ApiError(200, "no videos yet")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "channel videos fetched successfully")
        )
})

export {
    getChannelStats,
    getChannelVideos
}