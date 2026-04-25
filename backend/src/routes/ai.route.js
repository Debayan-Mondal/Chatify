import express from "express";
import { summarizeMessage } from "../controllers/ai.controller.js";
const router = express.Router();



router.post('/summarize', summarizeMessage);

export default router;