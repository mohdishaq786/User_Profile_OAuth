const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
  token: String,
  expiresAt: Date,
});

const BlacklistedToken = mongoose.model(
  "BlacklistedToken",
  blacklistedTokenSchema
);

module.exports = BlacklistedToken;
