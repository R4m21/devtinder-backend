const express = require("express");

const app = express();
const PORT = process.env.PORT || 7777;

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

app.use("/user/data", (req, res) => {
  // try {
    // db logic here
    throw new Error("hdchchhbc");
    // res.send("get data")
  // } catch (error) {
    // res.status(500).send("something is wrong in user data");
  // }
});

// wild card match routes its handle all routes if any error is occurred its order its maintained its priority, yto isjo kabhi last me likhne ka koi bhi error ayega to ye catch karega because javacript and express ye line by line or route match krta hai, if ham iske top pe likhe ke to vaha pe error nhi miegga koi route se error aya aur last me handle nhi kiya hai user ko  pura error log milega joki understanding nhi hoga.
// express js dynamic parameter leta hai jese 2 params hai to req, res, 3 params hai to req, res, next, 4 parmas hai to err, req, res, next. its sequence matter krta hai.

app.use("/", (err, req, res, next) => {
  if (err) {
    // log error
    res.status(500).send("something went wrong");
  }
});

app.listen(PORT, () => {
  console.log(`server successfully listening on port ${PORT}...`);
});
