const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

const TokenBlacklist = require("../Model/tokenBlacklistModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  // console.log("reach here--->", req.session);
  if (req.session.isGoogleAuthenticated) {
    req.user = await User.findById(req.session.userId).select("-password");
    return next();
  }
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const protectLogout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isBlacklisted = await TokenBlacklist.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({ message: "Token has been blacklisted." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized." });
  }
};

module.exports = { protect, protectLogout };
