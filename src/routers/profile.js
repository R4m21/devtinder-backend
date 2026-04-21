const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const User = require("../models/user");
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    return res.send(req.user);
  } catch (err) {
    return res.status(400).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    validateEditProfileData(req);

    // // 1. findByIdAndUpdate (Direct DB Update)
    // const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    //   returnDocument: "after",
    //   runValidators: true,
    // });
    // return res.send(user);

    // 2. loggedInUser.save() (Document-Based Update) its most recommended for validation and its already fetch data from DB
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

module.exports = profileRouter;
