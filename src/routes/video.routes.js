import { Router } from "express";
import { deleteVideo, getAllVideos, getVideoById, publishVideo, togglePublish, updateVideoDetails } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/getAllVideos").get(getAllVideos)
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

router.route("/getVideoById/:id").get(getVideoById);
router.route("/updateVideoDetails/:id").patch(
    verifyJWT,
    upload.single('thumbnail'),
    updateVideoDetails
)
router.route("/deleteVideo/:id").delete(verifyJWT,deleteVideo)
router.route("/togglePublish/:id").patch(verifyJWT,togglePublish)

export default router