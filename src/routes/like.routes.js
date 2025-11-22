import { Router } from "express";
import { getLikedVideos, toggleCommentLike, toggleVideoLike } from "../controllers/like.controller.js";
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router=Router()

router.use(verifyJWT)
router.route("/toggleVideoLike/:id").post(toggleVideoLike)
router.route("/toggleCommentLike/:id").post(toggleCommentLike)
router.route("/getLikedVideos").get(getLikedVideos)

export default router