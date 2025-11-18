import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const options = {
    httpOnly: true,
    secure: true
}

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accsessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accsessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, error.message || `error in generating tokens!`)
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get text data from frontend
    const { username, fullName, email, password } = req.body;
    //check for empty values
    if ([username, fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!!")
    }
    //check for existing user
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    if (existingUser) {
        throw new ApiError(409, "user with this email or username already exists!!")
    }
    //store images localpath
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req?.files?.coverImage?.[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required!!")
    }
    //upload images on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //check if avatar is there
    if (!avatar) {
        throw new ApiError(400, "Avatar is required!!")
    }
    //create user object and create user
    const user = await User.create({
        username: username.toLowerCase(),
        fullName,
        email,
        password,
        avatar: {
            url: avatar?.url,
            public_id: avatar?.public_id
        },
        coverImage: {
            url: coverImage?.url ?? "",
            public_id: coverImage?.public_id ?? "",
        }
    })
    //remove password and refreshtoken
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    //check if user is created or not
    if (!createdUser) {
        throw new ApiError(500, "something went wrong in user registration!!")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    //get data from frontend
    const { username, email, password } = req.body;
    //validate null data
    if (!(username || email)) {
        throw new ApiError(400, "username or email is required!!")
    }
    //find if user exists or not
    const user = await User.findOne({
        $or: [
            { email },
            { username }
        ]
    });
    if (!user) {
        throw new ApiError(404, "user does not exists!!")
    }
    //validate password
    const passwordValidation = await user.isPasswordCorrect(password)
    if (!passwordValidation) {
        throw new ApiError(401, "invalid user Credentials!!")
    }

    //generate tokens
    const { accsessToken, refreshToken } = await generateTokens(user._id)

    //remove fields not to send 
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accsessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accsessToken, refreshToken
                },
                "User loggedIn successfully!!"
            )
        )


})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(
            new ApiResponse(200, {}, "Logout Successfully")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) {
            throw new ApiError(401, "unauthorized request!!")
        }
        const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedRefreshToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token!!")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "invalid refresh token!!")
        }
        const { accsessToken, refreshToken } = await generateTokens(user._id)
        return res
            .status(200)
            .cookie("accessToken", accsessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accsessToken,
                        refreshToken
                    },
                    "Access Token Refresh successfull"
                )
            )
    } catch (error) {
        throw new ApiError(500, error.message || "Error in refreshing token!!")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // console.log(req.user)
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old Password")
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, "Password changed successfully")
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "current user get successfull"
            ),
        );

})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { email, fullName } = req.body;
    if (!(email || fullName)) {
        throw new ApiError("400", "All fields are required!!")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                email: email ?? req.user.email,
                fullName: fullName ?? req.user.fullName
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Details updated successfully")
        )
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is missing!!")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "error in uploading Avatar!!")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                avatar: {
                    url: avatar.url,
                    public_id: avatar.public_id
                }
            }
        },
        { new: true }
    ).select("-password");
    //delete old avatar from cloudinary
    const publicId = req.user.avatar.public_id
    const deleteAvatar = await deleteFromCloudinary(publicId)

    return res
        .status(200)
        .json(new ApiResponse(200, {
            user,
            deleteAvatar
        }, "Avatar updated successfully"))
})

const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image is missing!!")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage.url) {
        throw new ApiError(400, "error in uploading CoverImage!!")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                coverImage: {
                    url: coverImage.url,
                    public_id: coverImage.public_id
                }
            }
        },
        { new: true }
    ).select("-password");
    //delete old coverImage from cloudinary
    let deleteCoverImage;
    if (req.user.coverImage.url && req.user.coverImage.public_id) {
        const publicId = req.user.coverImage.public_id
        deleteCoverImage = await deleteFromCloudinary(publicId)
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            user,
            deleteCoverImage
        }, "cover image updated successfully"))
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username?.trim()) {
        throw new ApiError(400, "username is missing!!")
    }
    const channel = await User.aggregate([
        {
            //find user
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            //to see who are the subscribers of channel
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            //to see to whom i subscribed to
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            //to add field in which we want above values count
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true, 
                        else: false
                    }
                }
            }
        },
        {
            //to pass values which are required
            $project: {
                fullName: 1,
                username: 1,
                email: 1,
                subscribersCount: 1,
                isSubscribed: 1,
                channelsSubscribedToCount: 1,
                avatar: 1,
                coverImage: 1
            }
        }
    ])
    if (!channel?.length) {
        throw new ApiError("404", "channel not found!!")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, channel[0], "User channel fetched successfully")
        )
})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                //to select userdata from user table 
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            //to get only needed info about user
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        //so that dont have to access element like owner[0].username etc..
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(200, user[0].watchHistory, "watch history fetched successfully")
        )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateCoverImage,
    updateUserAvatar,
    getUserChannelProfile,
    getWatchHistory
}