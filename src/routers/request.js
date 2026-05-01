const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  validateConnectionRequest,
  validateConnectionReview,
} = require("../utils/validation");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // validate connection request
      validateConnectionRequest(req);

      const { status, toUserId } = req.params;
      const loggedInUser = req.user;
      const fromUserId = loggedInUser._id;

      // check toUser is in DB or not
      const toUser = await User.findById(toUserId);
      if (!toUser) throw new Error("User not found");

      // check fromUser already send connection request then prevent to again or also toUser send connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest)
        throw new Error("Connection request is already exist");

      const connectionRequest = await new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        success: true,
        message: `${loggedInUser.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // validate connection review
      validateConnectionReview(req);

      const loggedInUser = req.user;
      const { status, requestId } = req?.params || {};

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest)
        throw new Error("connection request is not found");

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      return res.json({
        success: true,
        message: `you have ${status} connection request successfully`,
        data,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  },
);

module.exports = requestRouter;
