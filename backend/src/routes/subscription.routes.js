import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { getChannelsSubscribedTo, getChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const router=Router();

router.route("/toggleSubscription/:channelId").post(verifyJWT,toggleSubscription)
router.route("/getChannelSubscribers/:channelId").get(getChannelSubscribers)
router.route("/getChannelsSubscribedTo/:subscriberId").get(verifyJWT,getChannelsSubscribedTo)


export default router