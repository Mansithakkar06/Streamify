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
            ref: "User"
        },
        status:{
            type:Boolean,
        }
    }, { timestamps: true })

export const Like = model("Like", likeSchema)