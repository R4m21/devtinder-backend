const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, minLength: 4, maxLength: 50 },
    lastName: { type: String, minLength: 4, maxLength: 50 },
    emailId: {
      type: String,
      required: [true, "email is required"],
      unique: true,
      validate: {
        validator: function (v) {
          // Yeh Regex check karega ki email format sahi hai ya nahi
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props) => `${props.value} this email is not valid`,
      },
    },
    password: { type: String, required: true, minLength: 8, maxLength: 32 },
    age: { type: Number, min: 18 },
    gender: {
      type: String,
      validate: function (val) {
        if (!["male", "female", "other"].includes(val)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png",
    },
    about: { type: String, default: "its default about for user" },
    skills: { type: [String] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
