const express = require("express");

const app = express();
const PORT = process.env.PORT || 7777;

const { adminAuth, userAuth } = require("./middlewares/auth");

// app.use("/user", userAuth); // its middleware for separate route then not use its use direct middleware there need that place like this:=> app.get("/user/getData", userAuth, (req, res) => {}
// app.post("/user/login", (req, res) => {} and here login its not userAuth to bound

app.use("admin", adminAuth); // its common middleware for all route for start with /admin

app.post("/user/login", (req, res) => {
  console.log("user login successfully");
  res.send("user login successfully");
});

app.get("/user/getData", userAuth, (req, res) => {
  console.log("get user data");
  res.send("get user data");
});

app.get("/admin/getData", (req, res) => {
  console.log("get admin data");
  res.send("get user data");
});

app.listen(PORT, () => {
  console.log(`server successfully listening on port ${PORT}...`);
});
