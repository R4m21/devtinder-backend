require("./config/env");
const express = require("express");

const { connectDB } = require("./config/database");

const app = express();

const PORT = process.env.PORT || 7777;

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
