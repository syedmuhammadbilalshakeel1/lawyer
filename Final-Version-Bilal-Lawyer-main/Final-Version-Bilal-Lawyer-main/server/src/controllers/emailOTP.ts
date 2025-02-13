import { config } from "dotenv";
import nodemailer from "nodemailer";
import { Request, Response } from "express";
import crypto from "crypto";
config();

const otpStorage = new Map<string, string>();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});

export const sendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
  otpStorage.set(email, otp); // Store OTP temporarily

  const mailOptions = {
    from: process.env.AUTH_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email", error });
  }
};
export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  console.log("🚀 ~ verifyOTP ~ otp:", otp);

  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP are required" });

  const storedOtp = otpStorage.get(email);

  if (!storedOtp)
    return res.status(400).json({ message: "OTP expired or not found" });

  if (storedOtp === otp) {
    otpStorage.delete(email); // Remove OTP after successful verification
    res.json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
};

export default { sendOTP, verifyOTP };
