import Post from "../Models/Post.model.js";
import User from "../Models/User.model.js";
import Notification from "../Models/Notification.js";
import { v2 as cloudinary } from "cloudinary";
export const createPOst = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { txt } = req.body;
    let { img } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    if (!txt && !img)
      res.status(400).send({
        success: false,
        message: "Please provide text or image",
      });

    if (img) {
      const response_url = await cloudinary.uploader.upload(img);
      img = response_url.secure_url;
    }
    const post = new Post({
      user: userId,
      txt,
      img,
    });
    await post.save();
    res.status(200).send({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(404)
        .send({ success: false, message: "Post not found" });
    }
    if (post?.user?.toString() !== userId.toString()) {
      return res
        .status(401)
        .send({ success: false, message: "You are not authorized" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const LikeunLikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(400)
        .send({ success: false, message: "Post Not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User Not Found" });
    }
    const postLiked = post.likes.includes(userId);
    if (postLiked) {
      await post.updateOne({ _id: id }, { $pull: { likes: userId } });
      await user.updateOne({ _id: userId }, { $pull: { likedposts: id } });
      const updateLikes = post.likes.filter(
        (id) => id.toHexString() !== userId.toString()
      );
      res.status(201).json(updateLikes);
    } else {
      post.likes.push(userId);
      await user.updateOne({ _id: userId }, { $push: { likedposts: id } });
      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();
      await post.save();
      res.status(201).json("post liked", post.likes);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    if (post.length === 0) {
      return res.status(400).json([]);
    }
    res.status(200).send({ success: true, message: "All Post", post });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Internal Server error ", error });
  }
};

export const likedPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      res.status(400).send({ success: false, message: "User not found" });
    }
    const post = await Post.find({ _id: { $in: user.likedposts } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).send({ success: true, message: "Liked Post", post });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server error " });
  }
};

export const followerPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    const post = await Post.find({ user: { $in: user.followings } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).send({ success: true, message: "Follower Post", post });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Internal server error ", error });
  }
};

export const userPost = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    const post = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).send({ success: true, message: "User Post", post });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Internal server error ", error });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;
    const userId = req.user._id;
    if (!text) {
      return res
        .status(400)
        .send({ success: false, message: "Text is required" });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res
        .status(400)
        .send({ success: false, message: "Post Not found" });
    }
    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();
    res
      .status(200)
      .send({ success: true, message: "Comment added successfully", post });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Internal server error ", error });
  }
};
