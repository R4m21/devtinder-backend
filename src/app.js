const express = require("express");

const app = express();
const PORT = process.env.PORT || 7777;

// app.use(route, route handler function1,...route handler functionN);
// app.use(route, rH1, rH2, rH3, rH4, rH5);
// app.use(route, [rH1, rH2, rH3, rH4, rH5]);
// app.use(route, rH1, rH2, [rH3, rH4], rH5);
// all are gives same response

app.use(
  "/user",
  (req, res, next) => {
    console.log("response 1");
    // res.send("response 1");
    next(); // its throwing error because server already send response and its again send the response then connection already closed
  },
  (req, res, next) => {
    console.log("response 2");
    // res.send("response 2");
    next();
  },
  (req, res, next) => {
    console.log("response 3");
    // res.send("response 3");
    next();
  },
  (req, res, next) => {
    console.log("response 4");
    // res.send("response 4");
    next();
  },
  (req, res, next) => {
    console.log("response 5");
    res.send("response 5");
    next(); // its throwing error because server need next handler function, so its showing error :-> Cannot GET /user
  },
);

app.listen(PORT, () => {
  console.log(`server successfully listening on port ${PORT}...`);
});
