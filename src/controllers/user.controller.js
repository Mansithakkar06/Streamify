import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser=asyncHandler(async(req,res)=>{
    //get data from frontend
    const {username,fullName,email,password}=req.body;
    //check for empty values
    if([username,fullName,email,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required!!")
    }
    //check for existing user
    const existingUser=await  User.findOne({
        $or:[{email},{username}]
    })
    if(existingUser){
        throw new ApiError(409,"user with this email or username already exists!!")
    }
    //store images localpath
    const avatarLocalPath=req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0)
    {
        coverImageLocalPath=req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required!!")
    }
    //upload images on cloudinary
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    
    //check if avatar is there
    if(!avatar){
        throw new ApiError(400,"Avatar is required!!")
    }
    //create user object and create user
    const user=await User.create({
        username:username.toLowerCase(),
        fullName,
        email,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
    })
    //remove password and refreshtoken
    const createdUser=await User.findById(user._id).select("-password -refreshToken")
    //check if user is created or not
    if(!createdUser){
        throw new ApiError(500,"something went wrong in user registration!!")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
})

export {registerUser}