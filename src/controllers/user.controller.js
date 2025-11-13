import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from "jsonwebtoken"

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
    //get data from frontend
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
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;
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
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
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
        const {accsessToken,refreshToken}=await generateTokens(user._id)
        return res
        .status(200)
        .cookie("accessToken",accsessToken,options)
        .cookie("refreshToken",refreshToken,options)
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
        throw new ApiError(500,error.message || "Error in refreshing token!!")
    }
})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body;
    const user=User.findById(req.user?._id)
    const isPasswordCorrect=user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old Password")
    }
    user.password=newPassword;
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
        new ApiResponse(200,"Password changed successfully")
    )
})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            res.user,
            "current user get successfull"
        ),
    ) ;

})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {email,fullName}=req.body;
    if(!(email || fullName)){
        throw new ApiError("400","All fields are required!!")
    }
    const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                email,
                fullName
            }
        },
        {
            new:true
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Details updated successfully")
    )
})

const updaeUserAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is missing!!")
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(400,"error in uploading Avatar!!")
    }
    const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Avatar updated successfully"))
})

const updaeCoverImage=asyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.file?.path
    if(!coverImageLocalPath){
        throw new ApiError(400,"Cover Image is missing!!")
    }
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage.url){
        throw new ApiError(400,"error in uploading CoverImage!!")
    }
    const user=await User.findByIdAndUpdate(req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    ).select("-password");

    return res
    .status(200)
    .json(new ApiResponse(200,user,"cover image updated successfully"))
})

export { registerUser, loginUser, logoutUser ,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updaeCoverImage,updaeUserAvatar  }