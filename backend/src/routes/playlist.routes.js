import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlayList, createPlayList, deletePlayList, getPlayListById, getUserPlayLists, removeVideoFromPlayList, updatePlayList } from "../controllers/playlist.controller.js";

const router=Router();

router.use(verifyJWT)
router.route("/createPlayList").post(createPlayList)
router.route("/getUserPlayLists/:userId").get(getUserPlayLists)
router.route("/getPlayListById/:id").get(getPlayListById)
router.route("/addVideoToPlayList/:videoId/:playlistId").patch(addVideoToPlayList)
router.route("/removeVideoFromPlayList/:videoId/:playlistId").patch(removeVideoFromPlayList)
router.route("/deletePlayList/:playListId").delete(deletePlayList)
router.route("/updatePlayList/:playListId").patch(updatePlayList)


export default router;