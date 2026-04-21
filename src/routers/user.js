const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();

// get user data from userId
userRouter.get("/user", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).send("user not found");
    else res.send(user); // res.send() (All-rounder) - Ye ek general-purpose method hai jo alag-alag type ka data bhej sakta hai.
  } catch (err) {
    console.log(err.message);
    return res.status(400).send("something went wrong");
  }
});

// // PATCH ka matlab hota hai "sirf utna badlo jitni zaroorat hai".
// userRouter.patch("/user", async (req, res) => {
//   try {
//     const ALLOWED_UPDATES = [
//       "userId",
//       "photoUrl",
//       "about",
//       "gender",
//       "age",
//       "skills",
//     ];
//     const isUpdateAllowed = Object.keys(req.body).every((v) =>
//       ALLOWED_UPDATES.includes(v),
//     );
//     if (!isUpdateAllowed) throw new Error("Update not allowed for some fields");

//     const { userId, ...update } = req.body;

//     if (Object.keys(update).length === 0) {
//       return res.status(400).send("Nothing to update");
//     }

//     const user = await User.findByIdAndUpdate(userId, update, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     // const user = await User.updateOne({ _id: userId }, update); // its provide ack me modified and insert if found or not
//     console.log({ userId, update, user });
//     if (!user) return res.status(404).send("user not found");

//     return res.json({ message: "user updated successfully", data: user });
//   } catch (err) {
//     console.log(err.message);
//     return res.status(400).send(err.message || "Something went wrong");
//   }
// });

// PATCH ka matlab hota hai "sirf utna badlo jitni zaroorat hai".
userRouter.patch("/user/:userId", async (req, res) => {
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(req.body).every((v) =>
      ALLOWED_UPDATES.includes(v),
    );
    if (!isUpdateAllowed) throw new Error("Update not allowed for some fields");

    const userId = req.params.userId;
    const update = req.body;

    if (Object.keys(update).length === 0) {
      return res.status(400).send("Nothing to update");
    }

    const user = await User.findByIdAndUpdate(userId, update, {
      returnDocument: "after",
      runValidators: true,
    });
    // const user = await User.updateOne({ _id: userId }, update); // its provide ack me modified and insert if found or not
    console.log({ userId, update, user });
    if (!user) return res.status(404).send("user not found");

    return res.json({ message: "user updated successfully", data: user });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(err.message || "Something went wrong");
  }
});

// PUT ka matlab hota hai "poore resource ko badal dena".
userRouter.put("/user", async (req, res) => {
  try {
    const { userId, ...update } = req.body;
    // const user = await User.findByIdAndUpdate(userId, update, { new: true });
    const user = await User.replaceOne({ _id: userId }, update);
    if (!user) return res.status(404).send("user not found");
    else return res.json({ message: "user updated successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send("something went wrong");
  }
});

userRouter.delete("/user", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).send("user not found");
    else return res.json({ message: "user deleted successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send("something went wrong");
  }
});

// Feed API - GET - /feed - get the all users data from database
userRouter.get("/feed", async (req, res) => {
  try {
    const allUser = await User.find({});
    console.log("allUser", allUser);
    return res.json(allUser);
  } catch (err) {
    console.log(err.message);
    res.status(400);
    return res.send("something went wrong");
  }
});

module.exports = userRouter;
