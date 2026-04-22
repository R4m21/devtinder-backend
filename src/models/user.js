const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");
const isURL = require("validator/lib/isURL");
const isStrongPassword = require("validator/lib/isStrongPassword");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SALT_ROUND = Number(process.env.SALT_ROUND || 10);
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => isEmail(v),
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      validate: {
        validator: (v) => isStrongPassword(v),
        message: (props) => `Enter a strong password`,
      },
      // Note: Password की maxLength यहाँ बड़ी रखें क्योंकि Hashing के बाद साइज बढ़ जाता है
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
    },
    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender",
      },
    },
    photoUrl: {
      type: String,
      maxLength: 2048,
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png",
      validate: {
        validator: (v) => !v || isURL(v),
        message: "Invalid Photo URL",
      },
    },
    about: {
      type: String,
      maxLength: [250, "About section can't exceed 250 characters"],
      default: "its default about for user",
      trim: true,
    },
    skills: {
      type: [String],
      validate: {
        validator: function (v) {
          if (!v || v.length === 0) return true;
          return v && v.length >= 1 && v.length <= 10;
        },
        message: "Skills must be between 1 and 10 items",
      },
    },
  },
  { timestamps: true },
);

userSchema.methods.setPasswordHashInDB = async function () {
  try {
    const user = this;
    const passwordHash = await bcrypt.hash(user.password, SALT_ROUND);
    user.password = passwordHash;
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  try {
    const user = this;
    const passwordHash = user.password;
    const isValidPassword = await bcrypt.compare(
      passwordInputByUser,
      passwordHash,
    );
    return isValidPassword;
  } catch (err) {
    throw new Error("Something went wrong");
  }
};

userSchema.methods.setJwtAccessToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, JWT_ACCESS_SECRET, {
    expiresIn: "15m", // expired in 15min, standard expires is 10-15min, need to validate refresh token
  });
  return token;
};

module.exports = mongoose.model("User", userSchema);
