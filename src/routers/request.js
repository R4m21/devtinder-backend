const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/ignored/:userId",
  userAuth,
  async (req, res) => {
    try {
      res.send("connection send successfully...");
    } catch (err) {
      return res.status(400).send("Error : " + err.message);
    }
  },
);

module.exports = requestRouter;
