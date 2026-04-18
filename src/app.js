const express = require("express");

const app = express();
const PORT = process.env.PORT || 7777;

// This will match only GET HTTP method API call to /user (exact path match)
app.get("/user", (req, res) => {
  res.send({ firstName: "mani", lastName: "ram" });
});

app.post("/user", (req, res) => {
  // saving data to DB
  res.send("data successfully save on database!");
});

app.delete("/user", (req, res) => {
  // user deleted
  res.send("user deleted successfully!");
});

// This will match all HTTP method API call to /test (exact path match)
app.use("/test", (req, res) => {
  // request handler function its handle only /test request
  res.send("hello from the server test!");
});

app.listen(PORT, () => {
  console.log(`server successfully listening on port ${PORT}...`);
});
