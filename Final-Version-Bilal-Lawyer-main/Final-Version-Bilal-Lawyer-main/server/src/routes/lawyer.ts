import express from "express";
import {
  getAllCases,
  getAllLawyers,
  getCasesByEmail,
  getNotification,
  giveFeedbackAndRating,
  saveNotification,
  lawyerFormSubmit,
  updateLawyerForm,
  getNotifications,
  updateNotificationReadStatus,
  updateNotificationStatus,
  sendPayment,
  adminAssignCaseToJudge,
  getJudges,
  updateHearings,
  updateStatus,
  updateOutcome,
  uploadFile,
  getUploadFile,
} from "../controllers/controllers";

let router = express.Router();

// upload file
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "./files");
  },
  filename: function (req: any, file: any, cb: any) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.put("/uploadFile/:id", upload.single("pdf"), uploadFile);
router.get("/getUploadFile/:id", getUploadFile);

// ===================================================
router.post("/lawyerFormSubmit", lawyerFormSubmit);
router.get("/getAllCases", getAllCases);
router.put("/adminAssignCaseToJudge/:id", adminAssignCaseToJudge);

router.put("/updateLawyerForm/:id", updateLawyerForm);

router.get("/getCasesByEmail/:email", getCasesByEmail);
router.get("/getAllLawyers", getAllLawyers);
// Feedback and rating
router.put("/giveFeedbackAndRating/:id", giveFeedbackAndRating);

router.get("/getNotification/:id/:notificationId", getNotification);

// ===============================
router.post("/saveNotification/:senderId/:receiverId", saveNotification);
router.get("/getNotifications/:userId", getNotifications);
router.put(
  "/updateNotificationReadStatus/:notificationId",
  updateNotificationReadStatus
);
router.put(
  "/updateNotificationStatus/:notificationId",
  updateNotificationStatus
);
router.post("/sendPayment", sendPayment);

router.get("/getJudges", getJudges);
router.put("/updateHearings/:id", updateHearings);
router.put("/updateStatus/:id", updateStatus);
router.put("/updateOutcome/:id", updateOutcome);
export default router;
