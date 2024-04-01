const User = require("../Model/userModel");
const asyncHandler = require("express-async-handler");

const getOwnProfile = asyncHandler(async (req, res) => {
  try {
    console.log("id--------", req.user.id);
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const updateProfileVisibility = asyncHandler(async (req, res) => {
  try {
    console.log("id---g-----", req.user.id);
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (typeof req.body.isProfilePublic !== "undefined") {
      user.isProfilePublic = req.body.isProfilePublic;
    } else {
      user.isProfilePublic = !user.isProfilePublic;
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.photoUrl) user.photoUrl = req.body.photoUrl;

    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      phone: user.phone,
      photoUrl: user.photoUrl,
      isProfilePublic: user.isProfilePublic,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isProfilePublic || req.user.role === "admin") {
      res.json(user);
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const getPublicUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isProfilePublic) {
      return res.json({
        _id: user._id,
        name: user.name,
        bio: user.bio,
        photoUrl: user.photoUrl,
        phone: user.phone,
        email: user.email,
      });
    } else {
      // The profile is not public
      return res
        .status(403)
        .json({ message: "Access to this profile is restricted." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error occurred." });
  }
});

module.exports = {
  getOwnProfile,
  updateProfileVisibility,
  getUserProfile,
  getPublicUserProfile,
};
