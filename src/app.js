const express = require("express");

const app = express();
const PORT = process.env.PORT || 7777;

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/user", userAuth);
app.use("admin", adminAuth);

app.get("/user/getData", (req, res) => {
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
