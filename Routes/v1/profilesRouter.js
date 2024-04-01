const express = require("express");
const router = express.Router();
const { protect } = require("../../Middlewares/authMiddleWare");
const { isAdmin } = require("../../Middlewares/roleMiddleWare"); // Make sure this path is correct
const {
  getOwnProfile,
  updateProfileVisibility,
  getUserProfile,
  getPublicUserProfile,
} = require("../../Controllers/profilesController");

// Route to get the logged-in user's profile remains unchanged
router.route("/v1/profile").get(protect, getOwnProfile);

// Route to update the logged-in user's profile visibility remains unchanged
router.route("/v1/profile/visibility").put(protect, updateProfileVisibility);

// /restrict
router.route("/v1/user/:userId").get(protect, isAdmin, getUserProfile);
router.route("/v1/public-profile/:userId").get(protect, getPublicUserProfile);
module.exports = router;
