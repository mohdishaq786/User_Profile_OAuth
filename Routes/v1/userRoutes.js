const express = require("express");
const passport = require("passport");
const router = express.Router();
const dotenv = require("dotenv").config(); // Ensure environment variables are loaded
const generateToken = require("../../Utility/generateToken");
// Import your controller functions
const {
  registerUser, // Corrected typo here
  authUser,
  logoutUser,
} = require("../../Controllers/userController");

// Middleware for protecting routes
const { protectLogout } = require("../../Middlewares/authMiddleWare");

// // Determine the callback URL based on the environment
const callbackURL =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_CALLBACK_URL
    : "http://localhost:5000/v1/auth/google/callback";

// Register routes
router.route("/v1/register").post(registerUser);
router.route("/v1/login").post(authUser);
router.route("/v1/logout").post(protectLogout, logoutUser);

// Google OAuth Routes
// Initiating Google OAuth
router.get(
  "/v1/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback route
router.get(
  "/v1/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/v1/login" }),
  async (req, res) => {
    // console.log("req.users", req.user);
    if (req.user) {
      token = generateToken(req.user._id);
      console.log("token->>", token);
      req.session.isGoogleAuthenticated = true;
      req.session.userId = req.user._id;
      res
        .cookie("token", token, { httpOnly: true, secure: true })
        .redirect(
          process.env.NODE_ENV === "production"
            ? PROD_URL + "/api/profiles/v1/profile"
            : "http://localhost:5000/api/profiles/v1/profile"
        );
    }
  }
);
module.exports = router;
