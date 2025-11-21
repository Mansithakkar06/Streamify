import { Router } from "express";
import { changeCurrentPassword, deleteWatchHistory, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, removeFromWatchHistory, updateAccountDetails, updateCoverImage, updateUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/register").post(
   upload.fields([
    {
        name:"avatar",
        maxCount:1,
    },
    {
        name:"coverImage",
        maxCount:1,
    },
   ]),
    registerUser
)
router.route("/login").post(loginUser)

//auth routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT,changeCurrentPassword)
router.route("/getCurrentUser").get(verifyJWT,getCurrentUser)
router.route("/updateAccountDetails").patch(verifyJWT,updateAccountDetails)
router.route("/updateAvtar").patch(verifyJWT,upload.single('avatar'),updateUserAvatar)
router.route("/updateCoverImage").patch(verifyJWT,upload.single('coverImage'),updateCoverImage)
router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)
router.route("/removeFromHistory/:videoId").delete(verifyJWT,removeFromWatchHistory)
router.route("/deleteHistory").delete(verifyJWT,deleteWatchHistory)



export default router