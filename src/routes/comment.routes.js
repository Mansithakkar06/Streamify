import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";

const router=Router()

router.route("/addComment/:videoId").post(verifyJWT,addComment)
router.route("/updateComment/:id").patch(verifyJWT,updateComment)
router.route("/deleteComment/:id").delete(verifyJWT,deleteComment)
router.route("/getVideoComments/:videoId").get(getVideoComments)

export default router