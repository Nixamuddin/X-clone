import express from "express";
import { ProtectedRoutes } from "../Middleware/ProtectedRoutes.js";
import {
  deleteNotification,
  getNotification,
} from "../Controller/Notification.js";

const NotificationRoutes = express.Router();
NotificationRoutes.get("/", ProtectedRoutes, getNotification);
NotificationRoutes.delete("/:id", ProtectedRoutes, deleteNotification);
export default NotificationRoutes;
