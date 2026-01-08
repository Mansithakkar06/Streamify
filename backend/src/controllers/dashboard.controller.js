import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
    //Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const id = req.user?._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "invalid id!!")
    }
    const totalVideos = await Video.countDocuments({ owner: id })

    const Subscriberscount = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $count: "subscribers"
        }
    ])
    const totalSubscribers = Subscriberscount[0]?.subscribers || 0;
    const viewsCount = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                }
            }
        }
    ])
    const totalViews = viewsCount[0]?.totalViews || 0;
    const likesCount = await Like.aggregate([
        {
            $match: {
                reaction: "like"
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoData"
            }
        },
        {
            $match: {
                "videoData.owner": new mongoose.Types.ObjectId(id)
            }
        },
        {
            $count: "totalLikes"
        },

    ])
    const totalLikes = likesCount[0]?.totalLikes || 0;
    return res.status(200).json(
        new ApiResponse(200, {
            totalLikes: totalLikes,
            totalSubscribers: totalSubscribers,
            totalVideos: totalVideos,
            totalViews: totalViews
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
    const videos = await Video.aggregate([
        // 1️⃣ Only videos of a user
        {
            $match: {
                owner: new mongoose.Types.ObjectId(id)
            }
        },

        // 2️⃣ Get owner info
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        { $unwind: "$owner" },

        // 3️⃣ Get likes & dislikes
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "reactions"
            }
        },

        // 4️⃣ Count likes & dislikes
        {
            $addFields: {
                likesCount: {
                    $size: {
                        $filter: {
                            input: "$reactions",
                            as: "reaction",
                            cond: { $eq: ["$$reaction.reaction", "like"] }
                        }
                    }
                },
                dislikesCount: {
                    $size: {
                        $filter: {
                            input: "$reactions",
                            as: "reaction",
                            cond: { $eq: ["$$reaction.reaction", "dislike"] }
                        }
                    }
                }
            }
        },

        // 5️⃣ Final response shape
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                isPublished:1,
                duration: 1,
                views: 1,
                likesCount: 1,
                dislikesCount: 1,
                owner: {
                    _id: "$owner._id",
                    username: "$owner.username",
                    avatar: "$owner.avatar"
                },
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);


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