const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const userRouter = require("./Routes/v1/userRoutes");
const profilesRouter = require("./Routes/v1/profilesRouter");
const { errorHandler, notFound } = require("./Middlewares/errorMiddleWare");
const session = require("express-session");
const passport = require("passport");
require("./GoogleConfig/googlePassport");
const swaggerUi = require("swagger-ui-express");

const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
dotenv.config();
// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();
// CORS middleware
app.use(cors());
// Serve the Swagger documentation
app.use("/api/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Body parser middleware to parse JSON bodies
app.use(express.json());

// Session middleware for session management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true, // Mitigate XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // Cookie expiration set to 24 hours
    },
  })
);

// Initialize Passport and session for authentication
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.redirect("/api/v1/api-docs");
});

app.use("/api/user", userRouter);
app.use("/api/profiles", profilesRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`
  );
});
