import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getChatUser, getMessagesByUserId, sendMessage } from "../controllers/message.controller.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

//router.use(arcjetProtection);
router.use(protectRoute);
router.get("/contact", getAllUsers);
router.get("/chats", getChatUser);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);



export default router