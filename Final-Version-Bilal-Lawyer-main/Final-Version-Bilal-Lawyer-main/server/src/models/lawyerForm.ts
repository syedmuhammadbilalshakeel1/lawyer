import mongoose from "mongoose";

const LawyerForm = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  lawyerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  judgeType: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  caseType: {
    type: String,
    required: true,
  },
  caseDescription: {
    type: String,
    required: true,
  },
  caseDate: {
    type: Date,
    required: false,
  },
  judgeFeedback: {
    type: String,
    required: false,
  },
  assignedTime: {
    type: String,
    required: false,
  },
  assignedDate: {
    type: Date,
    required: false,
  },
  assignedTo: {
    type: String,
    required: false,
  },
  files: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "PdfDetails" }],
    default: [],
  },

  hearings: {
    type: String,
    required: false,
    default: "0", // Default value set to "0"
  },
  outcome: {
    type: String,
    required: false,
    enum: ["Pending", "Won", "Lost"],
    default: "Pending", // Default value set to "Pending"
  },
  status: {
    type: String,
    required: false,
    enum: ["Pending", "Active", "Ended"],
  },
});

export const lawyerForm = mongoose.model("LawyerForm", LawyerForm);
