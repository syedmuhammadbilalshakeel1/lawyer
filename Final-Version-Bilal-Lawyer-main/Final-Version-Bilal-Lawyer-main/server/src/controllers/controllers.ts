import mongoose from "mongoose";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Notification } from "../models/notification";
import { User } from "../models/users";
import { lawyerForm } from "../models/lawyerForm";
import path from "path";
import Stripe from "stripe";
import { config } from "dotenv";
import { PdfDetails } from "../models/file";

config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

// http://localhost:8080/api/updateProfile/677d6d5c11d7c717871396f8
const updateProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    console.log("🚀 ~ updateProfile ~ id:", id);
    const { fullName, email, phoneNumber, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      const { path, filename } = req.file;
      user.path = path;
      user.filename = filename;
    }

    await user.save();

    res.status(200).send({ msg: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send({ error: "Unable to update profile" });
  }
};

// http://localhost:8080/api/getUserProfile/677d6d5c11d7c717871396f8
const getUserProfile = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "User profile retrieved successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve user profile." });
  }
};

// http://localhost:8080/api/userProfileImage/677d6d5c11d7c717871396f8
const userProfileImage = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    console.log("🚀 ~ userProfileImage ~ id:", id);

    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const image = await User.findById(id);
    if (!image) res.send("msg Image not found");
    const imagePath = path.join(__dirname, "../../uploads", image.filename);
    res.sendFile(imagePath);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve user profile." });
  }
};
// http://localhost:8080/api/uploadFile/67a3688ef93944bb80fa5218
const uploadFile = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const file = req.file;

    if (!id || !file) {
      return res
        .status(400)
        .json({ message: "LawyerForm ID and file are required." });
    }

    const lawyerFormData = await lawyerForm.findById(id);
    if (!lawyerFormData) {
      return res.status(404).json({ message: "LawyerForm not found." });
    }

    const pdfDetails = new PdfDetails({
      title,
      pdf: file.filename,
    });

    await pdfDetails.save();

    lawyerFormData.files.push(pdfDetails._id);
    await lawyerFormData.save();

    res
      .status(200)
      .json({ message: "File uploaded successfully!", pdfDetails });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Failed to upload file." });
  }
};

// http://localhost:8080/api/getUploadFile/67a3688ef93944bb80fa5218
const getUploadFile = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Check if the LawyerForm exists
    const lawyerFormData = await lawyerForm.findById(id).populate("files");
    if (!lawyerFormData) {
      return res.status(404).json({ message: "LawyerForm not found." });
    }

    // Get all the PdfDetails files related to the LawyerForm
    const files = lawyerFormData.files;

    res.status(200).json({ message: "Files retrieved successfully!", files });
  } catch (error) {
    console.error("Error retrieving files:", error);
    return res.status(500).json({ message: "Failed to retrieve files." });
  }
};

// http://localhost:8000/api/register
const registerUser = async (req: any, res: any) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      password,
      role,
      termsAccepted,
      lawyerField,
      experience,
      judgeField,
      court,
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate terms acceptance
    if (!termsAccepted) {
      return res
        .status(400)
        .json({ message: "You must accept the terms and conditions." });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use." });
    }

    // Validate role-specific fields
    if (role === "lawyer") {
      if (!lawyerField) {
        return res
          .status(400)
          .json({ message: "Lawyers must specify a specialty." });
      }

      if (experience === undefined || experience <= 0) {
        return res
          .status(400)
          .json({ message: "Lawyers must specify valid years of experience." });
      }
    }

    if (role === "judge" && !judgeField) {
      return res
        .status(400)
        .json({ message: "Judges must specify a court name." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      termsAccepted,
      lawyerField: role === "lawyer" ? lawyerField : undefined,
      experience: role === "lawyer" ? experience : undefined,
      judgeField: role === "judge" ? judgeField : undefined,
    });

    // Save the user to the database
    const savedUser = await user.save();

    console.log("User registered:", savedUser);
    return res.status(201).json({
      message: "User registered successfully",
      data: {
        id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        phoneNumber: savedUser.phoneNumber,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Failed to register user" });
  }
};

// // Admin register
// const registerAdmin = async (req: any, res: any) => {
//   try {
//     const { email, password, court } = req.body;

//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create admin user
//     const newAdmin = new User({
//       email,
//       password: hashedPassword,
//       role: "admin",
//       court, // Admin-specific field
//     });

//     await newAdmin.save();
//     res.status(201).json({ message: "Admin registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

const getJudges = async (req: any, res: any) => {
  try {
    // Fetch users with the role "judge"
    const judges = await User.find({ role: "judge" });

    if (judges.length === 0) {
      return res.status(404).json({ message: "No judges found." });
    }

    return res.status(200).json({
      message: "Judges fetched successfully",
      data: judges,
    });
  } catch (error) {
    console.error("Error fetching judges:", error);
    return res.status(500).json({ message: "Failed to fetch judges" });
  }
};

// http://localhost:8080/api/updateHearings/679d378efc8d5c49ee721de0
const updateHearings = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { hearings } = req.body;

    if (!hearings) {
      return res.status(400).json({ error: "Hearings field is required" });
    }

    const updatedCase = await lawyerForm.findByIdAndUpdate(
      id,
      { hearings },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    res.json({ message: "Hearings updated successfully", updatedCase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if status is provided
    if (!status) {
      return res.status(400).json({ error: "Status field is required" });
    }

    // Find and update the status of the case by ID
    const updatedCase = await lawyerForm.findByIdAndUpdate(
      id,
      { status }, // Only update the status field
      { new: true }
    );

    // If no case was found with the given ID
    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    // Send the response with updated case data
    res.json({ message: "Status updated successfully", updatedCase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOutcome = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { outcome } = req.body;

    // Check if outcome is provided
    if (!outcome) {
      return res.status(400).json({ error: "Outcome field is required" });
    }

    // Find and update the outcome of the case by ID
    const updatedCase = await lawyerForm.findByIdAndUpdate(
      id,
      { outcome }, // Only update the outcome field
      { new: true }
    );

    // If no case was found with the given ID
    if (!updatedCase) {
      return res.status(404).json({ error: "Case not found" });
    }

    // Send the response with updated case data
    res.json({ message: "Outcome updated successfully", updatedCase });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// http://localhost:8000/api/login
const loginUser = (req: any, res: any) => {
  const { email, password, role } = req.body;
  console.log("🚀 ~ loginUser ~ req.body:", req.body);

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ message: "'email', 'password', and 'role' are required" });
  }

  const normalizedEmail = email.toLowerCase();

  User.findOne({ email: normalizedEmail })
    .then((user: any) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const userRole = user.role || "client";

      if (userRole !== role) {
        return res
          .status(403)
          .json({ message: `Forbidden: You cannot log in as a ${role}` });
      }

      const allowedRoles = ["client", "lawyer", "judge", "admin"];
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden: Invalid role" });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          userEmail: user.email,
          userRole,
        },
        "RANDOM-TOKEN",
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        userId: user._id,
        userEmail: user.email,
        role: userRole,
        token,
      });
    })
    .catch((error: any) => {
      console.error("Error finding user:", error);
      res.status(500).json({ message: "Server error" });
    });
};

// http://localhost:8080/api/lawyerFormSubmit
const lawyerFormSubmit = (req: any, res: any) => {
  const {
    clientName,
    lawyerName,
    email,
    phoneNumber,
    judgeType,
    priority,
    caseType,
    caseDescription,
    assignedDate,
    assignedTo,
    status,
  } = req.body;

  const lawyerData = new lawyerForm({
    clientName,
    lawyerName,
    email,
    phoneNumber,
    judgeType,
    priority,
    caseType,
    caseDescription,
    assignedDate: assignedDate || null,
    assignedTo: assignedTo || null,
    status: status || "Pending",
  });

  lawyerData
    .save()
    .then((saveData: any) => {
      console.log("✅ Data submitted successfully:", saveData);
      res.json({ message: "Data submitted successfully", data: saveData });
    })
    .catch((error: any) => {
      console.error("❌ Error submitting data:", error);
      res
        .status(500)
        .json({ message: "Failed to submit data", error: error.message });
    });
};

// http://localhost:8080/api/getAllCases
const getAllCases = (req: any, res: any) => {
  lawyerForm
    .find()
    .then((lawyers: any) => {
      res.json({ message: "Data fetched successfully", data: lawyers });
    })
    .catch((error: any) => {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: "Failed to fetch data" });
    });
};

// http://localhost:8080/api/adminAssignCaseToJudge/679be071437d9ebd46a8e2c8
const adminAssignCaseToJudge = (req: any, res: any) => {
  const { id } = req.params;
  const { status, assignedTo, assignedTime, assignedDate } = req.body;

  const updateData: any = {};

  if (status) updateData.status = status;
  if (assignedTo) updateData.assignedTo = assignedTo;
  if (assignedTime) updateData.assignedTime = assignedTime;
  if (assignedDate) updateData.assignedDate = assignedDate;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No update data provided" });
  }

  lawyerForm
    .findByIdAndUpdate(id, updateData, { new: true })
    .then((updatedData: any) => {
      if (!updatedData) {
        return res.status(404).json({ message: "Lawyer form not found" });
      }
      res.json({ message: "Data updated successfully", data: updatedData });
    })
    .catch((error: any) => {
      console.error("❌ Error updating data:", error);
      res
        .status(500)
        .json({ message: "Failed to update data", error: error.message });
    });
};

// http://localhost:8080/api/updateLawyerForm/677ab8374efca1b886f784d5
const updateLawyerForm = (req: any, res: any) => {
  const { id } = req.params;
  const { caseDate, judgeFeedback, caseStatus } = req.body;

  const updateData: any = {};

  if (caseDate) updateData.caseDate = caseDate;
  if (judgeFeedback) updateData.judgeFeedback = judgeFeedback;
  if (caseStatus) updateData.caseStatus = caseStatus;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No update data provided" });
  }

  lawyerForm
    .findByIdAndUpdate(id, updateData, { new: true })
    .then((updatedData: any) => {
      if (!updatedData) {
        return res.status(404).json({ message: "Lawyer form not found" });
      }
      res.json({ message: "Data updated successfully", data: updatedData });
    })
    .catch((error: any) => {
      console.error("Error updating data:", error);
      res.status(500).json({ message: "Failed to update data" });
    });
};

// http://localhost:8080/api/getCaseByEmail/adeelkayani586@gmail.com
const getCasesByEmail = (req: any, res: any) => {
  const { email } = req.params;
  console.log("🚀 ~ getCasesByEmail ~ email:", email);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  lawyerForm
    .find({ email }) // Use `.find()` to fetch all matching documents
    .then((caseData: any[]) => {
      if (!caseData || caseData.length === 0) {
        return res.status(404).json({ message: "No cases found" });
      }
      res.json({ message: "Cases fetched successfully", data: caseData });
    })
    .catch((error: any) => {
      console.error("Error fetching cases:", error);
      res.status(500).json({ message: "Failed to fetch cases" });
    });
};

const getAllLawyers = async (req: any, res: any) => {
  try {
    // Fetch all users with the role "lawyer"
    const lawyers = await User.find({ role: "lawyer" });

    // Check if no lawyers were found
    if (lawyers.length === 0) {
      return res.status(404).json({ message: "No lawyers found." });
    }

    // Return all lawyers with their full data
    return res.status(200).json({
      message: "Lawyers fetched successfully.",
      data: lawyers, // Return the full data for each lawyer
    });
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    return res.status(500).json({ message: "Failed to fetch lawyers." });
  }
};

// http://localhost:8080/api/giveFeedbackAndRating/677e9749afbaaba5e4cd6fe6
const giveFeedbackAndRating = async (req: any, res: any) => {
  const { id } = req.params; // Lawyer's ID from request parameters
  console.log("🚀 ~ giveFeedbackAndRating ~ id:", id);
  const { comment, rating, clientName } = req.body; // Feedback message, rating, and the person's name
  console.log("req.body", req.body);

  // Validate input
  if (!comment || typeof comment !== "string") {
    return res
      .status(400)
      .json({ message: "Feedback message is required and must be a string" });
  }
  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    return res.status(400).json({
      message: "Rating is required and must be a number between 1 and 5",
    });
  }
  if (!clientName || typeof clientName !== "string") {
    return res.status(400).json({
      comment: "Name of the person giving clientFeedback is required",
    });
  }

  try {
    // Find the lawyer and add clientFeedback
    const lawyer = await User.findById(id);
    if (!lawyer || lawyer.role !== "lawyer") {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    // Add clientFeedback to the lawyer's clientFeedback array with the current date
    const feedback = {
      comment,
      rating,
      clientName,
      date: new Date(),
    };

    lawyer.clientFeedback.push(feedback);

    // Save the lawyer document
    await lawyer.save();

    res.status(200).json({
      message: "Feedback added successfully",
      clientFeedback: lawyer.clientFeedback,
    });
  } catch (error) {
    console.error("Error adding clientFeedback:", error);
    res.status(500).json({ message: "Failed to add clientFeedback" });
  }
};

// http://localhost:8080/api/getNotification/67961b3244c2ba8a63fc015a/67965c2844589a01c3a3a1c5
const getNotification = async (req: any, res: any) => {
  const { id, notificationId } = req.params; // `id` is the lawyer's ID and `notificationId` is the notification ID

  try {
    // Find the lawyer by ID
    const lawyer = await User.findById(id);
    if (!lawyer || lawyer.role !== "lawyer") {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    // Find the specific notification
    const notification = lawyer.notifications.find(
      (notification: any) => notification._id.toString() === notificationId
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ notification });
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ message: "Failed to fetch notification" });
  }
};

// ===================================================================
const saveNotification = async (req: Request, res: Response) => {
  try {
    const { senderId } = req.params; // User ID
    const { receiverId } = req.params; // User ID
    const {
      senderName,
      receiverName,
      caseType,
      senderEmail,
      senderPhoneNum,
      caseDescription,
    } = req.body;

    // Validate required fields
    if (
      !senderName ||
      !receiverName ||
      !caseType ||
      !senderEmail ||
      !senderPhoneNum ||
      !caseDescription
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    // Find the user
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "sender not found." });
    }
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "receiver not found." });
    }

    // Create and save a new notification
    const newNotification = new Notification({
      senderName,
      receiverName,
      caseType,
      senderEmail,
      senderPhoneNum,
      caseDescription,
    });

    const savedNotification = await newNotification.save();

    // Associate the notification with the user
    sender.notifications.push(savedNotification._id);
    receiver.notifications.push(savedNotification._id);
    await Promise.all([sender.save(), receiver.save()]);

    res.status(201).json({
      message: "Notification saved successfully.",
      notification: savedNotification,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// http://localhost:8080/api/getNotifications/6795f157873b0a429e2c4b85
const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // User ID

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    // Find the user and populate the notifications
    const user = await User.findById(userId).populate("notifications");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Notifications fetched successfully.",
      notifications: user.notifications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// http://localhost:8080/api/updateNotificationReadStatus/679a4c6ee883c586e882011d
const updateNotificationReadStatus = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params; // Notification ID
    const { read } = req.body; // New read status (true/false)

    // Validate the read field
    if (typeof read !== "boolean") {
      return res
        .status(400)
        .json({ message: "The 'read' field must be a boolean value." });
    }

    // Validate notification ID
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ message: "Invalid notification ID." });
    }

    // Find the notification by ID
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // Update the read field
    notification.read = read;

    // Save the updated notification
    const updatedNotification = await notification.save();

    res.status(200).json({
      message: "Notification read status updated successfully.",
      notification: updatedNotification,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// http://localhost:8080/api/updateNotificationStatus/679a4c6ee883c586e882011d
const updateNotificationStatus = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params; // Notification ID
    const { status } = req.body; // New status value (e.g., "Pending", "Resolved")

    // Define allowed statuses
    const allowedStatuses = ["Pending", "Accepted", "Active", "Rejected"];

    // Validate the status field
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    // Validate notification ID
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ message: "Invalid notification ID." });
    }

    // Find the notification by ID
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    // Update the status field
    notification.status = status;

    // Save the updated notification
    const updatedNotification = await notification.save();

    res.status(200).json({
      message: "Notification status updated successfully.",
      notification: updatedNotification,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Stripe Integration
// http://localhost:8080/api/sendPayment
const sendPayment = async (req: Request, res: Response) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ error: "Email, and amount are required" });
    }

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Payment",
            },
            unit_amount: amount * 100, // Convert amount to cents (e.g., $10 -> 1000 cents)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/dashboard",
      cancel_url: "http://localhost:3000/dashboard",
      customer_email: email,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating payment session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// =================================================

export {
  // registerAdmin,
  registerUser,
  getJudges,
  loginUser,
  lawyerFormSubmit,
  getAllCases,
  adminAssignCaseToJudge,
  updateLawyerForm,
  getAllLawyers,
  updateProfile,
  getUserProfile,
  userProfileImage,
  getCasesByEmail,
  giveFeedbackAndRating,
  getNotification,
  saveNotification,
  getNotifications,
  updateNotificationReadStatus,
  updateNotificationStatus,
  sendPayment,
  updateHearings,
  updateStatus,
  updateOutcome,
  uploadFile,
  getUploadFile,
};
