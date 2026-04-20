require("./config/env");
const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt");
const {
  validationSignupData,
  validationLoginData,
} = require("./utils/validation");
const User = require("./models/user");
const app = express();
const PORT = process.env.PORT || 7777;
const SALT_ROUND = process.env.SALT_ROUND || 10;

app.use(express.json());

// JSON Error Handling
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .send({ status: 400, message: "Invalid JSON format" });
  }
  next();
});

app.post("/signup", async (req, res) => {
  // Creating a new instance of the User model
  try {
    // validation check
    validationSignupData(req);

    // need to password hash before the saving data on database
    const { firstName, lastName, emailId, password } = req.body;
    const hashPassword = await bcrypt.hash(password, Number(SALT_ROUND));

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    console.log(await user.save());
    return res.send("user added successfully...");
  } catch (err) {
    return res.status(400).send("Error : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    // validation check
    validationLoginData(req);

    // need to password compare with db store hashPassword
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credential");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credential");
    }
    return res.send("login successfully...");
  } catch (err) {
    return res.status(400).send("Error : " + err.message);
  }
});

// get user data from userId
app.get("/user", async (req, res) => {
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
// app.patch("/user", async (req, res) => {
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
app.patch("/user/:userId", async (req, res) => {
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
app.put("/user", async (req, res) => {
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

app.delete("/user", async (req, res) => {
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
app.get("/feed", async (req, res) => {
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

// global error handler
app.use((err, req, res, next) => {
  // check error stack - which file error is occurred
  console.error("SERVER ERROR:", err.stack);

  // to send global message
  res.status(err.status || 500).send({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

connectDB()
  .then(() => {
    console.log("Database connected successfully...");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });
