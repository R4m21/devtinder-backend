require("./config/env");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");
const userRouter = require("./routers/user");
const app = express();
const PORT = process.env.PORT || 7777;

app.use(express.json());
app.use(cookieParser());

// JSON Error Handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .send({ status: 400, message: "Invalid JSON format" });
  }
  next();
});

app.use(authRouter);
app.use(profileRouter);
app.use(requestRouter);
app.use(userRouter);

// global error handler
app.use((err, req, res, next) => {
  // check error stack - which file error is occurred
  console.error("SERVER ERROR:", err.stack);

  // to send global message
  res.status(err.status || 500).send({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

connectDB()
  .then(() => {
    console.log("Database connected successfully...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
