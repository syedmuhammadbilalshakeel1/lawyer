import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["client", "lawyer", "judge", "admin"],
      lowercase: true,
    },
    court: {
      type: String,
      required: function () {
        return this.role === "admin";
      },
      trim: true,
    },
    termsAccepted: {
      type: Boolean,
      required: function () {
        return this.role !== "admin";
      },
      default: false,
    },
    lawyerField: {
      type: String,
      required: function () {
        return this.role === "lawyer";
      },
      trim: true,
    },
    experience: {
      type: Number,
      required: function () {
        return this.role === "lawyer";
      },
      min: [0, "Experience cannot be negative"],
    },
    casesWon: {
      type: Number,
      default: 0,
      required: function () {
        return this.role === "lawyer";
      },
      min: [0, "Cases won cannot be negative"],
    },
    casesLost: {
      type: Number,
      default: 0,
      required: function () {
        return this.role === "lawyer";
      },
      min: [0, "Cases lost cannot be negative"],
    },
    judgeField: {
      type: String,
      required: function () {
        return this.role === "judge";
      },
      trim: true,
    },
    clientFeedback: {
      type: [
        {
          comment: {
            type: String,
            trim: true,
          },
          rating: {
            type: Number,
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"],
          },
          clientName: {
            type: String,
            required: [
              true,
              "The name of the person giving clientFeedback is required",
            ],
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
    notifications: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
      default: [],
    },
    path: {
      type: String,
    },
    filename: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", UserSchema);
