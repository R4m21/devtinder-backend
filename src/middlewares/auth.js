const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const userAuth = async (req, res, next) => {
  try {
    const { accessToken } = req?.cookies || {};

    if (!accessToken) throw new Error("Invalid token");
    const decodedObj = jwt.verify(accessToken, JWT_ACCESS_SECRET);
    const { _id } = decodedObj || "";
    if (!_id) throw new Error("Invalid token");
    const user = await User.findById(_id);
    if (!user) throw new Error("Invalid token");

    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send("Error : " + err.message || "Invalid token");
  }
};

module.exports = {
  userAuth,
};
