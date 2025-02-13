import express from "express";
import { sendOTP, verifyOTP } from "../controllers/emailOTP";

let router = express.Router();

// Send Contact Mail Message
router.post("/sendOTP", sendOTP);
router.post("/verifyOTP", verifyOTP);

export default router;
