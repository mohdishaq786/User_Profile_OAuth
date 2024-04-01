const mongoose = require("mongoose");
const url =
  "mongodb+srv://ishaqmohd50:ySMYSnHXaJEs6b1f@cluster0.jbopmhk.mongodb.net/";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
