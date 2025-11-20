import mongoose, { model, Schema } from "mongoose";

const likeSchema = new Schema(
    {
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        likedBy:
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required:true,
        },
        reaction:{
            type:String,
            enum:["like","dislike"]
        }
    }, { timestamps: true })

export const Like = model("Like", likeSchema)