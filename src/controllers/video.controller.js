import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImageFromCloudinary, deleteVideoFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
    //TODO: get videos by filter,pagination,user,sorting etc..
    const videos = await Video.find({})
    if (!videos.length) {
        throw new ApiError(200, "No video found!!")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Videos fetched successfully")
        )
})

const publishVideo = asyncHandler(async (req, res) => {
    //collect text data 
    const { title, description } = req.body;
    //validate for null values
    if (!(title && description)) {
        throw new ApiError(400, "Title and Description are required!!")
    }
    //collect files
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required!!")
    }
    const videoLocalPath = req.files?.videoFile?.[0]?.path;
    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required!!")
    }
    //upload files to cloudinary
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    const videoFile = await uploadOnCloudinary(videoLocalPath)
    //check if uploaded or not
    if (!thumbnail) {
        throw new ApiError(500, "error uploading thumbnail!!")
    }
    if (!videoFile) {
        throw new ApiError(500, "error uploading videoFile!!")
    }
    //create document in database
    const video = await Video.create({
        title,
        description,
        thumbnail: {
            url: thumbnail.url,
            public_id: thumbnail.public_id
        },
        videoFile: {
            url: videoFile.url,
            public_id: videoFile.public_id
        },
        duration: videoFile.duration,
        owner: new mongoose.Types.ObjectId(req.user?._id)
    })
    if (!video) {
        throw new ApiError(500, "error in creating video!!")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "Video uploaded successfully")
        )

})

const getVideoById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid id!!")
    }
    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                owner: {
                    //get details which are needed
                    username: "$user.username",
                    avatar: "$user.avatar"
                }
            }
        }
    ])
    if (!video.length) {
        throw new ApiError(404, "Video not found")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, video[0], "Video fetched successfully")
        )
})

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    //validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid id!!")
    }

    let { title, description } = req.body;
    
    const oldvideo = await Video.findById(id)
    if (!oldvideo) {
        throw new ApiError(404, "video not found")
    }
    if (!(title && description)) {
        title=oldvideo.title
        description=oldvideo.description
    }

    const thumbnailLocalPath = req.file?.path;
    let url, public_id, deleteThumbnail;
    //if updating thumbnail add it on cloudinary
    if (thumbnailLocalPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
        url = thumbnail.url;
        public_id = thumbnail.public_id
        //delete old thumbnail
        if(!thumbnail){
            throw new ApiError("500","error in uploading on cloudinary")
        }
        deleteThumbnail = await deleteImageFromCloudinary(oldvideo.thumbnail.public_id)
    }
    //if not updating thumbnail keep previos one
    else {
        url = oldvideo.thumbnail.url;
        public_id = oldvideo.thumbnail.public_id
    }
    const video = await Video.findByIdAndUpdate(id,
        {
            $set: {
                title,
                description,
                thumbnail: {
                    url: url,
                    public_id: public_id
                }
            }
        },
        {
            new: true
        }
    )
    if (!video) {
        throw new ApiError(500, "error in updating video details!!")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, {
                video,
                deleteThumbnail
            }, "video details updated successfully")
        )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { id } = req.params
    //validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid id!!")
    }

    //find video
    const video = await Video.findById(id)
    if (!video) {
        throw new ApiError(404, "video not found!!")
    }
    const thumbnail = video.thumbnail.public_id
    const videoFile = video.videoFile.public_id

    //delete thumbnail and video from cloudinary
    const deleteThumbnail = await deleteImageFromCloudinary(thumbnail)
    const deleteVideoFile = await deleteVideoFromCloudinary(videoFile)

    //delete record from database
    const deletedVideo = await Video.findByIdAndDelete(id)
    if (!deletedVideo) {
        throw new ApiError(500, "error in deleting video!!")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, {
                deleteThumbnail,
                deleteVideoFile,
                deletedVideo
            }, "video deleted successfully")
        )
})

const togglePublish = asyncHandler(async (req, res) => {
    const { id } = req.params
    //validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid id!!")
    }
    const video = await Video.findById(id)
    if (!video) {
        throw new ApiError(404, "video not found!!")
    }
    video.isPublished = !video.isPublished
    await video.save({ validateBeforeSave: false })
    return res
        .status(200)
        .json(
            new ApiResponse(200, video, "status changed successfully")
        )
})

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideoDetails,
    deleteVideo,
    togglePublish
}