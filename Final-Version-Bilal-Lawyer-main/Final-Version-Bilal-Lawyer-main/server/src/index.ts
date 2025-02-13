import { Request, Response } from "express";
import auth from "./routes/auth";
import lawyer from "./routes/lawyer";
import otp from "./routes/otp";
import { config } from "dotenv";
import mongoose from "mongoose";
import express from "express";
import Stripe from "stripe";

config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

const app = express();
app.use(express.json());
app.use(express.static("uploads"));

app.use("/uploads", express.static("uploads"));
app.use("/files", express.static("files"));

app.use("/api", auth);
app.use("/api", lawyer);
app.use("/api", otp);

app.get("/", async (req: Request, res: Response) => {
  res.status(200).json({
    massege: "⚡️[server]: Server is running",
  });
});

const PORT = process.env.PORT || 8000;
const MONGO_URL = String(process.env.MONGO_URL);
mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    );
  })
  .catch((error: any) => console.log(`${error} did not connect`));
