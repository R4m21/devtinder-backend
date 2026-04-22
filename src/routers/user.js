const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const USER_SAFE_DATA = "firstName lastName age gender photoUrl skill about";

const userRouter = express.Router();

// get all pending connection request for loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const data = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    return res.json({
      message: "data fetch successfully",
      data,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

// get all accepting connection request for loggedIn user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId toUserId", USER_SAFE_DATA)
      .lean(); // for lean method its setter/getter method remove and make faster query

    const data = connectionRequests.map((doc) =>
      doc.fromUserId._id.toString() === loggedInUser._id.toString()
        ? doc.toUserId
        : doc.fromUserId,
    );

    return res.json({
      message: "data fetch successfully",
      data,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = userRouter;
