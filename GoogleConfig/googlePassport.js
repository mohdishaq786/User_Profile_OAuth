const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../Model/userModel");
const passport = require("passport");

const callbackURL = "http://localhost:5000/api/user/v1/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? process.env.PROD_CALLBACK_URL
          : process.env.CALLBACKURL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          // Optionally update user details if needed
          user.email = profile.emails[0].value;
          user.name = profile.displayName;
          await user.save();
        } else {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            // Add other desired profile fields
          });
        }
        cb(null, user);
      } catch (err) {
        console.error(err);
        cb(err, null);
      }
    }
  )
);

// Serializing the user to decide which data of the user object should be stored in the session
passport.serializeUser((user, done) => {
  done(null, user.id); // Here, user.id is used to identify the user uniquely
});

// Deserializing the user from the session data with the user ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error(err);
    done(err, null);
  }
});
// passport.deserializeUser((id, done) => {
//   User.findById(id, (err, user) => {
//     if (err) {
//       console.error(err); // Consider more robust logging for production use
//       return done(err);
//     }
//     if (!user) {
//       // Handling case where user might not be found
//       return done(null, false); // User not found
//     }
//     done(null, user);
//   });
// });
