import express from "express";
import {
  login,
  logout,
  me,
  registerUser,
} from "../Controller/Auth.controller.js";
import { ProtectedRoutes } from "../Middleware/ProtectedRoutes.js";
const AuthRoutes = express.Router();
AuthRoutes.post("/register", registerUser);
AuthRoutes.post("/login", login);
AuthRoutes.get("/me", ProtectedRoutes, me);
AuthRoutes.post("/logout", logout);

export default AuthRoutes;
