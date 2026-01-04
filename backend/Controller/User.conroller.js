import User from "../Models/User.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import Notification from "../Models/Notification.js";
export const GetProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "user Not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const followUnfollow = async (req, res) => {
  try {
    const { id } = req.params;
    const usertoModify = await User.findById(id);
    const currentuser = await User.findById(req.user._id);
    if (id === req.user._id.toString()) {
      return res.status(400).send({
        success: false,
        message: "You can't follow yourself",
      });
    }
    if (!currentuser && !usertoModify) {
      res.status(404).send({ success: false, message: "User not found" });
    }
    const isfollowing = currentuser.followings.includes(id);
    if (isfollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { followings: id } });
      res.status(200).send({
        success: true,
        message: "User unfollowed successfully",
      });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { followings: id } });
      const newNotification = new Notification({
        from: req.user._id,
        to: id,
        type: "follow",
      });
      await newNotification.save();
      res.status(200).send({
        success: true,
        message: "User followed successfully",
      });
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

export const suggestUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("followings");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.followings.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let {
      username,
      fullname,
      email,
      newpassword,
      currentpassword,
      links,
      bio,
    } = req.body;
    let { profilepicture, coverpicture } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    //if (!currentpassword && !newpassword) {
    //  return res.status(400).send({
    //    success: false,
    //    message: "Please provide current password or new password",
    //  });
    //}
    if (currentpassword && newpassword) {
      const isMatch = await user.comparepassword(
        currentpassword,
        user.password
      );
      if (!isMatch) {
        return res.status(400).send({
          message: "Current password is incorrect",
        });
      }
    }
    if (newpassword) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newpassword, salt);
      newpassword = hash;
      user.password = newpassword;
    }
    if (profilepicture) {
      if (user.profilePicture) {
        await cloudinary.uploader.destroy(
          user.profilePicture.split("/").pop().split(".")[0]
        );
      }
      const response_url = await cloudinary.uploader.upload(profilepicture);
      profilepicture = response_url.secure_url;
    }
    if (coverpicture) {
      if (user.coverPicture) {
        await cloudinary.uploader.destroy(
          user.coverPicture.split("/").pop().split(".")[0]
        );
      }
      const response_url = await cloudinary.uploader.upload(coverpicture);
      coverpicture = response_url.secure_url;
    }
    user.username = username || user.username;
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.profilePicture = profilepicture || user.profilePicture;
    user.coverPicture = coverpicture || user.coverPicture;
    user.links = links || user.links;
    user.bio = bio || user.bio;
    await user.save();
    user.password = null;
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      data: user,
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
