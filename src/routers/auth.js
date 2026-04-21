const express = require("express");
const {
  validationSignupData,
  validationLoginData,
} = require("../utils/validation");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // validation check
    validationSignupData(req);

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
    return res.send("user added successfully...");
  } catch (err) {
    return res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    // validation check
    validationLoginData(req);

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
      maxAge: 5 * 60 * 1000, // expired in 5 min its based on millisecond on current time
    });

    return res.send("login successfully...");
  } catch (err) {
    return res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("accessToken");
  return res.send("logout successfully...");
});

module.exports = authRouter;
