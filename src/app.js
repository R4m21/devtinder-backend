require("./config/env");
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const PORT = process.env.PORT || 7777;
app.use(express.json());

app.post("/signup", async (req, res) => {
  // Creating a new instance of the User model
  const user = new User(req.body);
  try {
    console.log(await user.save());
    return res.send("user added successfully...");
  } catch (error) {
    return res.status(400).send("Error saving the user:" + error.message);
  }
});

// // get user by email
// app.get("/user", async (req, res) => {
//   try {
//     const userEmail = req.body.emailId;
//     const users = await User.find({ emailId: userEmail });

//     if (!users.length) return res.status(404).send("users not found");
//     else {
//       console.log("users", users);
//       return res.json(users); // res.json() (Specifically for JSON) - Ye method tab use karte hain jab aapko sirf JSON data bhejna ho
//     }
//   } catch (error) {
//     console.log(error.message);
//     return res.status(400).send("something went wrong");
//   }
// });

// get user data from userId
app.get("/user", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).send("user not found");
    else res.send(user); // res.send() (All-rounder) - Ye ek general-purpose method hai jo alag-alag type ka data bhej sakta hai.
  } catch (error) {
    console.log(error.message);
    return res.status(400).send("something went wrong");
  }
});

// PATCH ka matlab hota hai "sirf utna badlo jitni zaroorat hai".
app.patch("/user", async (req, res) => {
  try {
    const { userId, ...update } = req.body;
    const user = await User.findByIdAndUpdate(userId, update, {
      returnDocument: "after",
      runValidators: true,
    });
    // const user = await User.updateOne({ _id: userId }, update); // its provide ack me modified and insert if found or not
    console.log({ userId, update, user });
    if (!user) return res.status(404).send("user not found");
    else return res.json({ message: "user updated successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send("something went wrong");
  }
});

// PUT ka matlab hota hai "poore resource ko badal dena".
app.put("/user", async (req, res) => {
  try {
    const { userId, ...update } = req.body;
    // const user = await User.findByIdAndUpdate(userId, update, { new: true });
    const user = await User.replaceOne({ _id: userId }, update);
    if (!user) return res.status(404).send("user not found");
    else return res.json({ message: "user updated successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).send("user not found");
    else return res.json({ message: "user deleted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(400).send("something went wrong");
  }
});

// Feed API - GET - /feed - get the all users data from database
app.get("/feed", async (req, res) => {
  try {
    const allUser = await User.find({});
    console.log("allUser", allUser);
    return res.json(allUser);
  } catch (error) {
    console.log(error.message);
    res.status(400);
    return res.send("something went wrong");
  }
});

connectDB()
  .then(() => {
    console.log("database is connected...");
    app.listen(PORT, () => {
      console.log(`server successfully listening on port ${PORT}...`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    console.log("database cannot be connected!!!");
  });
