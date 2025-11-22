import { Router } from "express";
import {verifyJWT} from '../middlewares/auth.middleware.js'
import { getChannelsSubscribedTo, getChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const router=Router();

router.use(verifyJWT);
router.route("/toggleSubscription/:channelId").post(toggleSubscription)
router.route("/getChannelSubscribers/:channelId").get(getChannelSubscribers)
router.route("/getChannelsSubscribedTo/:subscriberId").get(getChannelsSubscribedTo)


export default router