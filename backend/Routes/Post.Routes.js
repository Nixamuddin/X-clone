import express from "express";
import { ProtectedRoutes } from "../Middleware/ProtectedRoutes.js";
import {
  commentPost,
  createPOst,
  deletePost,
  followerPost,
  getAllPost,
  likedPost,
  LikeunLikePost,
  userPost,
} from "../Controller/Post.Controller.js";
const PostRoutes = express.Router();
PostRoutes.post("/create", ProtectedRoutes, createPOst);
PostRoutes.delete("/delete/:id", ProtectedRoutes, deletePost);
PostRoutes.post("/like/:id", ProtectedRoutes, LikeunLikePost);
PostRoutes.get("/", ProtectedRoutes, getAllPost);
PostRoutes.get("/likedpost", ProtectedRoutes, likedPost);
PostRoutes.get("/followerpost", ProtectedRoutes, followerPost);
PostRoutes.get("/getpost/:username", ProtectedRoutes, userPost);
PostRoutes.post("/comment/:id", ProtectedRoutes, commentPost);
export default PostRoutes;
