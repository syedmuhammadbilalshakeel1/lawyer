import mongoose from "mongoose";

const PdfFilesSchema = new mongoose.Schema({
  pdf: String,
  title: String,
});

export const PdfDetails = mongoose.model("PdfDetails", PdfFilesSchema);
