import express from "express";
import {
  followUnfollow,
  GetProfile,
  suggestUser,
  updateProfile,
} from "../Controller/User.conroller.js";
import { ProtectedRoutes } from "../Middleware/ProtectedRoutes.js";
const userRoutes = express.Router();
userRoutes.get("/:username", ProtectedRoutes, GetProfile);
userRoutes.post("/follow/:id", ProtectedRoutes, followUnfollow);
userRoutes.post("/profile", ProtectedRoutes, updateProfile);
userRoutes.get("/", ProtectedRoutes, suggestUser);

export default userRoutes;
