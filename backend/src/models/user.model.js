import mongoose, { model, Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            url:{
                type: String,
                required: true,
            },
            public_id:{
                type: String,
                required: true,
            }
        },
        coverImage: {
             url:{
                type: String,
            },
            public_id:{
                type: String,
            }
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "password is required!!"]
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
)

//this pre hook will check the password whenever some data is saved in users collection
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//this method will compare the password given by user and in collection
userSchema.methods.isPasswordCorrect = async function (password) {
    password=String(password)
    return await bcrypt.compare(password, this.password)
}

//to generate access token 
userSchema.methods.generateAccessToken = function () {
   return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

//to generate refresh token
userSchema.methods.generateRefreshToken = function () {
     return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = model("User", userSchema)