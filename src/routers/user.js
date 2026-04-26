const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName emailId age gender photoUrl skills about";

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
      success: true,
      message: "data fetch successfully",
      data,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
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
      success: true,
      message: "data fetch successfully",
      data,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    let page = Number(req?.query?.page) || 1;
    let limit = Number(req?.query?.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    let skip = (page - 1) * limit;

    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    hideUsersFromFeed.add(loggedInUser._id);
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId);
      hideUsersFromFeed.add(req.toUserId);
    });

    const data = await User.find(
      { _id: { $nin: Array.from(hideUsersFromFeed) } },
      USER_SAFE_DATA,
    )
      .skip(skip)
      .limit(limit);

    res.json({
      success: false,
      message: "data fetch successfully",
      data,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = userRouter;
