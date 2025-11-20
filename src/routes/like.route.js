import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleVideoLike } from "../controllers/like.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router=Router()

router.route("/toggleVideoLike/:id").post(verifyJWT,toggleVideoLike)
router.route("/toggleCommentLike/:id").post(verifyJWT,toggleCommentLike)
router.route("/getLikedVideos").get(verifyJWT,getLikedVideos)

export default router