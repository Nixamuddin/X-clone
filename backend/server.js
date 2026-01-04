import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/Connectdb.js";
import AuthRoutes from "./Routes/Auth.route.js";
import userRoutes from "./Routes/User.Routes.js";
import NotificationRoutes from "./Routes/Notification.Routes.js";
import PostRoutes from "./Routes/Post.Routes.js";
const app = express();
dotenv.config();
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/api/auth", AuthRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/notification", NotificationRoutes);
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

cloudinary.config({
  cloud_name: process.env.CLOUDINRY_NAME,
  api_key: process.env.CLOUDINRY_API,
  api_secret: process.env.CLOUDINRY_SECRET,
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
