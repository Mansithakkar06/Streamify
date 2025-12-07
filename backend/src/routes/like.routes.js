import { Router } from "express";
import { getLikedVideos, getVideoDislikes, getVideoLikes, toggleCommentLike, toggleVideoLike } from "../controllers/like.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router=Router()

router.route("/toggleVideoLike/:id").post(verifyJWT,toggleVideoLike)
router.route("/toggleCommentLike/:id").post(verifyJWT,toggleCommentLike)
router.route("/getLikedVideos").get(verifyJWT,getLikedVideos)
router.route("/getVideoLikes/:id").get(getVideoLikes)
router.route("/getVideoDislikes/:id").get(getVideoDislikes)




export default router