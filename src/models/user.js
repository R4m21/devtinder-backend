const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");
const isURL = require("validator/lib/isURL");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstname is required"],
      trim: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      minLength: 4,
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
        values: ["male", "female", "others"],
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

module.exports = mongoose.model("User", userSchema);
