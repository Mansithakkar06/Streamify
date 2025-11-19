import { Router } from "express";
import { getVideoById, publishVideo, updateVideoDetails } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/publish_video").post(
    verifyJWT,
    upload.fields([
        {
            name:"thumbnail",
            maxCount:1,
        },
        {
            name:"videoFile",
            maxCount:1
        }
    ]),
    publishVideo);

router.route("/getVideo/:id").get(getVideoById);
router.route("/updateVideoDetails").patch(
    verifyJWT,
    upload.single('thumbnail'),
    updateVideoDetails
)

export default router