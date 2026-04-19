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
