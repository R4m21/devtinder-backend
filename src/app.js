const express = require("express");

const app = express();
const PORT = process.env.PORT || 7777;

// app.use((req, res) => {
//   // request handler function its handle all request
//   res.send("hello from the server!");
// });

app.use("/test", (req, res) => {
  // request handler function its handle only /test request
  res.send("hello from the server test!");
});

app.use("/hello", (req, res) => {
  // request handler function its handle only /hello request
  res.send("hello hello server hello!");
});

app.use("/", (req, res) => {
  // request handler function its handle only / request (home) || its work with first match request path and return to response
  res.send("hello from the server home!");
});

app.listen(PORT, () => {
  console.log(`server successfully listening on port ${PORT}...`);
});
