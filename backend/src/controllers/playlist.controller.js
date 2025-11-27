import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { PlayList } from "../models/playlist.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createPlayList = asyncHandler(async (req, res) => {
    //fetch name
    const { name } = req.body;
    if (!name) {
        throw new ApiError(400, "name is required!!")
    }
    //if name is there check for existing name 
    const existingplaylist = await PlayList.findOne({ name: name });
    if (existingplaylist) {
        throw new ApiError(400, "PlayList with this name exists please give other name!!")
    }
    //create playlist
    const playlist = await PlayList.create({
        name: name,
        owner: req.user?._id
    })
    if (!playlist) {
        throw new ApiError(500, "error in creating playlist!!")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "playlist created successfully")
        )
})

const getUserPlayLists = asyncHandler(async (req, res) => {
    //get userid
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "invalid id!!")
    }
    //get playlist with this user id
    const playlists = await PlayList.find({ owner: userId })
    //if not there throw error
    if (!playlists.length) {
        new ApiError(200, "no playlists yet")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, playlists, "playlists fetched successfully")
        )
})

const getPlayListById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "invalid id!!")
    }
    const playlist = await PlayList.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        avatar: 1,
                                        fullName: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    },
                    {
                        $project:{
                            title:1,
                            thumbnail:1,
                            views:1,
                            owner:1,
                            duration:1,
                            createdAt:1
                        }
                    }
                ],

            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    },

                ]
            },

        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }
    ])
    if (!playlist.length) {
        throw new ApiError(400, "playlist not found!!")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "playlist fetched successfully")
        )

})

const addVideoToPlayList = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;
    if (!(mongoose.Types.ObjectId.isValid(videoId)) && (mongoose.Types.ObjectId.isValid(playlistId))) {
        throw new ApiError(400, "invalid id!!")
    }
    const playlistfind = await PlayList.findById(playlistId)
    if ((playlistfind.videos).includes(videoId)) {
        throw new ApiError(400, "video already added to playlist!!")
    }
    const playlist = await PlayList.findByIdAndUpdate(playlistId,
        {
            $push: {
                videos: videoId
            }
        },
        { new: true }
    )
    if (!playlist) {
        throw new ApiError(500, "something went wrong in adding to playlist!!")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, `video added to ${playlistfind.name}`)
        )
})

const removeVideoFromPlayList=asyncHandler(async(req,res)=>{
    const {videoId,playlistId}=req.params;
     if (!(mongoose.Types.ObjectId.isValid(videoId)) && (mongoose.Types.ObjectId.isValid(playlistId))) {
        throw new ApiError(400, "invalid id!!")
    }
    const oldplaylist=await PlayList.findById(playlistId)
    if(!oldplaylist.videos.length){
        throw new ApiError(400,"no video found!!")
    }
    if(!(oldplaylist.videos).includes(videoId)){
        throw new ApiError(400,"video does not exists!!")
    }

    const playlist=await PlayList.findByIdAndUpdate(playlistId,
        {
            $pull:{
                videos:videoId
            }
        },
        {new:true}
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200,playlist,"video removed from playlist!!")
    )    
})

const deletePlayList=asyncHandler(async(req,res)=>{
    const {playListId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(playListId)){
        throw new ApiError(400,"invalid id!!")
    }
    const playlist=await PlayList.findByIdAndDelete(playListId)
    if(!playlist){
        throw new ApiError(500,"something went wrong in deleting playlist!!")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,playlist,"playlist deleted successfully")
    )
})

const updatePlayList=asyncHandler(async(req,res)=>{
    const {playListId}=req.params;
    const {name}=req.body;
    if(!mongoose.Types.ObjectId.isValid(playListId)){
        throw new ApiError(400,"invalid id!!")
    }
    const playlist=await PlayList.findById(playListId)
    if(!name){
       throw new ApiError(400,"name is required!!")
    }
    playlist.name=name;
    await playlist.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(
        new ApiResponse(200,playlist,"playlist updated successfully")
    )
})

export {
    createPlayList,
    getUserPlayLists,
    getPlayListById,
    addVideoToPlayList,
    removeVideoFromPlayList,
    deletePlayList,
    updatePlayList
}