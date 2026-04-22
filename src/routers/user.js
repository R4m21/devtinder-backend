const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

// get all pending connection request for loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // 1. its mongodb query
    // const data = await ConnectionRequest.aggregate([
    //   { $match: { toUserId: loggedInUser._id, status: "interested" } },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "fromUserId",
    //       foreignField: "_id",
    //       as: "fromUser",
    //     },
    //   },
    //   { $unwind: "$fromUser" },
    //   {
    //     $project: {
    //       "fromUser.firstName": 1,
    //       "fromUser.lastName": 1,
    //       "fromUser.photoUrl": 1,
    //     },
    //   },
    // ]);

    // its mongoose query its avoid extra boiler plate code, its use then need to ref to your schema link
    const data = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      // .populate("fromUserId", ["firstName", "lastName", "photoUrl"]); // both are same result get
      .populate("fromUserId", "firstName lastName photoUrl");

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
