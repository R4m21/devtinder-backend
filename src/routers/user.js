const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName age gender photoUrl skills about";

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

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId);
      hideUsersFromFeed.add(req.toUserId);
    });

    const data = await User.find(
      { _id: { $nin: Array.from(hideUsersFromFeed) } },
      USER_SAFE_DATA,
    );

    res.json({
      message: "data fetch successfully",
      data: data,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
});

// userRouter.get("/user/feed", userAuth, async (req, res) => {
//   try {
//     /**
//      * 1. fetch all user exclude loggedInUser skip 0 limit 20  -> allUserData // send the 20 data after comes then skip 20 next 20 fetch
//      * 2. fetch all connection loggedInUser either toUserId or fromUserId -> allConnectionRequestData
//      * 3. filter allUserData by allConnectionRequestData if userId match in either toUserId or fromUserId
//      */

//     const loggedInUser = req.user;

//     const users = await User.aggregate([
//       { $match: { _id: { $ne: loggedInUser._id } } }, // Pehle hi khud ko hatao
//       {
//         $lookup: {
//           from: "connectionrequests", // Collection name
//           let: { userId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     {
//                       $or: [
//                         { $eq: ["$fromUserId", "$$userId"] },
//                         { $eq: ["$toUserId", "$$userId"] },
//                       ],
//                     },
//                     {
//                       $or: [
//                         { $eq: ["$fromUserId", loggedInUser._id] },
//                         { $eq: ["$toUserId", loggedInUser._id] },
//                       ],
//                     },
//                   ],
//                 },
//               },
//             },
//           ],
//           as: "connection",
//         },
//       },
//       { $match: { "connection.0": { $exists: false } } }, // Sirf wahi dikhao jahan connection na ho
//       { $limit: 20 },
//       {
//         $project: {
//           firstName: 1,
//           lastName: 1,
//           emailId: 1,
//           age: 1,
//           gender: 1,
//           photoUrl: 1,
//           skills: 1,
//           about: 1,
//         },
//       },
//     ]);

//     console.log(users);
//     let data = users;

//     res.json({
//       message: "data fetch successfully",
//       data: data,
//       count: data.length,
//     });
//   } catch (err) {
//     return res.status(400).json({
//       message: err.message,
//     });
//   }
// });

module.exports = userRouter;
