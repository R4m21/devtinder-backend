require("./config/env");
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const PORT = process.env.PORT || 7777;

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "ram",
    lastName: "mani",
    emailId: "ram@mani.com",
    password: "Ram@123",
  });
  try {
    console.log(await user.save());
    res.send("user added successfully...");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database is connected...");
    app.listen(PORT, () => {
      console.log(`server successfully listening on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.log("database cannot be connected!!!");
  });
