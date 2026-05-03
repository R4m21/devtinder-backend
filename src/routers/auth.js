const express = require("express");
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validation");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // validation check
    validateSignupData(req);

    // need to password hash before the saving data on database
    const { firstName, lastName, emailId, password } = req.body;
    const user = new User({
      firstName,
      lastName,
      emailId,
      password,
    });

    await user.setPasswordHashInDB();
    await user.save();

    const accessToken = await user.setJwtAccessToken();
    res.cookie("accessToken", accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(201).json({
      success: true,
      message: `Hello ${user.firstName}, you have signup successfully...`,
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    // validation check
    validateLoginData(req);

    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credential");

    // need to password compare and validated with db store passwordHash
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) throw new Error("Invalid credential");

    // need to create json web token here after password is validated
    const accessToken = await user.setJwtAccessToken();
    res.cookie("accessToken", accessToken, {
      // expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // expired in 1 hour, its base on date
      maxAge: 24 * 60 * 60 * 1000, // expired in 5 min its based on millisecond on current time
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.json({
      success: true,
      message: `Hello ${user.firstName}, you have login successfully...`,
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  // res.clearCookie("accessToken", {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "none",
  // });
  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
    path: "/",
  });
  return res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = authRouter;
