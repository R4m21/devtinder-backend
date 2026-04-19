const express = require("express");

const app = express();
const PORT = process.env.PORT || 7777;

// we can use regex here
app.get(/.*abc\/(\d+)\/(\w+)/, (req, res) => {
  // http://localhost:7777/helloabc/123/mani?userName=mani&userId=123
  console.log("req.path", req.path); // console.log -> /helloabc/123/mani
  console.log("req.query", req.query); // console.log -> { userName: 'mani', userId: '123' }
  console.log("req.params", req.params); // console.log -> { '0': '123', '1': 'mani' }
  res.send({ firstName: "mani", lastName: "ram" });
});

// query parameter and its get value by req.query
app.get("/user", (req, res) => {
  console.log("req", req.query); // console.log -> { userName: 'mani', userId: '123' }
  res.send({ firstName: "mani", lastName: "ram" });
});

// dynamic routing and its get value by req.params
app.get("/user/:userId", (req, res) => {
  console.log(req.params); // console.log -> { userId: '123' }
  res.send({ firstName: "mani", lastName: "ram" });
});

app.get("/user/:userId/:name", (req, res) => {
  console.log(req.params); // console.log -> { userId: '123', name: 'mani' }
  res.send({ firstName: "mani", lastName: "ram" });
});

app.listen(PORT, () => {
  console.log(`server successfully listening on port ${PORT}...`);
});
