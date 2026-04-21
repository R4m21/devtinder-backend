const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user");
const isStrongPassword = require("validator/lib/isStrongPassword");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    return res.json({
      message: `hello ${loggedInUser.firstName}`,
      data: loggedInUser,
    });
  } catch (err) {
    return res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditProfileData(req);

    const loggedInUser = req.user;
    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field]),
    );
    await loggedInUser.save();

    return res.json({
      message: `${loggedInUser.firstName}, your profile is updates successfully...`,
      data: loggedInUser,
    });
  } catch (err) {
    return res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = req.body;
    if (!isStrongPassword(password)) throw new Error("Enter a strong password");
    const loggedInUser = req.user;
    loggedInUser.password = password;
    await loggedInUser.setPasswordHashInDB();
    await loggedInUser.save();
    return res.json({
      message: "password update successfully...",
      data: loggedInUser,
    });
  } catch (err) {
    return res.status(400).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
