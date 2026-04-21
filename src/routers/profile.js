const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    return res.send(req.user);
  } catch (err) {
    return res.status(400).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
