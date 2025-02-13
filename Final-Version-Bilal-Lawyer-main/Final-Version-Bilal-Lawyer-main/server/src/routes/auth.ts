import express from "express";
import {
  getUserProfile,
  loginUser,
  // registerAdmin,
  registerUser,
  updateProfile,
  userProfileImage,
} from "../controllers/controllers";
import multer from "multer";
let router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// routes ======================================

// updateProfile
router.put("/updateProfile/:id", upload.single("image"), updateProfile);

// getProfile
router.get("/getUserProfile/:id", getUserProfile);
router.get("/userProfileImage/:id", userProfileImage);

router.post("/register", registerUser);
router.post("/login", loginUser);

// admin register
// router.post("/registerAdmin", registerAdmin);

export default router;
