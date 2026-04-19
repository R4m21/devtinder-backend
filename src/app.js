const express = require("express");

const app = express();
const PORT = process.env.PORT || 7777;

// Middleware Express.js ka ek aisa function hai jiske paas Request (req), Response (res), aur agle function ka access (next) hota hai. Ye request-response cycle ko beech mein hi manipulate ya end karne ki taqat rakhta hai

app.use("/user", (req, res, next) => {
  console.log("response user");
  const token = "xyz";
  const isAuthorized = token === "xyz";
  console.log("get data for user");
  if (isAuthorized) {
    next();
  } else {
    res.status(401).send("unauthorized");
  }
});

// same route hai to ham ek route ke next() call kr ke second joki same route hai to vahi pe call transfer kr sakte means jese first route handle response nhi dena chahta hai to vo next() call krke uske same exect match route ko pass krte hai call ise hi middleware kahte hai joki bich me request ko intercept krta hai aur modified kr sakta hai aur next fucntion call kr sakta hai
app.use("/user", (req, res) => {
  console.log("get data for user");
  res.send("get data for user");
});

app.get("/user/getData", (req, res) => {
  // const token = "xyz";
  // const isAuthorized = token === "xyz";
  // console.log("get data for user");
  // if (isAuthorized) {
    res.send("get data for user");
  // } else {
  //   res.status(401).send("unauthorized");
  // }
});

app.use("/admin", (req, res, next) => {
  const token = "xyzd";
  const isAuthorized = token === "xyz";
  console.log("admin response");
  if (isAuthorized) {
    res.send("get data for admin");
  } else {
    res.status(401).send("unauthorized");
  }
});

app.listen(PORT, () => {
  console.log(`server successfully listening on port ${PORT}...`);
});
