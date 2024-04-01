const User = require("../Model/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../Utility/generateToken");
const BlacklistedToken = require("../Model/tokenBlacklistModel");
const registerUser = asyncHandler(async (req, res) => {
  //   console.log("print");
  const { name, email, password, bio, phone, photoUrl, isProfilePublic, role } =
    req.body;
  try {
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send({ message: "User already exists" });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please Fill all the feilds" });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      bio,
      phone,
      photoUrl,
      isProfilePublic,
      role,
    });
    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        bio: newUser.bio,
        photoUrl: newUser.photoUrl,
        token: generateToken(newUser._id),
      });
    } else {
      return res.status(400).json({ error: "failed to add new user" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log(req.body, "bofy");
    const userExists = await User.findOne({ email });
    console.log("pppcppp", User);
    if (userExists && (await userExists.matchPassword(password))) {
      res.status(201).json({
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        password: userExists.password,
        bio: userExists.bio,
        photoUrl: userExists.photoUrl,
        token: generateToken(userExists._id),
      });
    } else {
      res.status(400).json({ error: "failed to login" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//logout
const logoutUser = asyncHandler(async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const expiresAt = new Date(req.user.exp * 1000);

    await BlacklistedToken.create({
      token: token,
      expiresAt: expiresAt,
    });

    res.status(200).json({ message: "Successfully logged out." });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error during logout." });
  }
});

module.exports = { registerUser, authUser, logoutUser };
