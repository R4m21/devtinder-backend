const isStrongPassword = require("validator/lib/isStrongPassword");
const isEmail = require("validator/lib/isEmail");
const isURL = require("validator/lib/isURL");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req?.body || {};
  if (!firstName || !lastName) {
    throw new Error("Enter a valid name");
  }
  if (!isEmail(emailId)) {
    throw new Error("Enter a valid email id");
  }
  if (!isStrongPassword(password)) {
    throw new Error("Enter a valid password");
  }
};

const validateLoginData = (req) => {
  const { emailId, password } = req.body;

  if (!emailId || !password || !isEmail(emailId)) {
    throw new Error("Invalid credential");
  }
};

const validateEditProfileData = (req) => {
  const update = Object.keys(req?.body);
  const ALLOWED_UPDATES = ["age", "gender", "photoUrl", "about", "skills"];

  // 1. Field Whitelisting (Security)
  const isValidOperation = update.every((field) =>
    ALLOWED_UPDATES.includes(field),
  );
  if (!isValidOperation) throw new Error("Invalid Updates!");

  // 2. Value Validation (Data Quality)
  const { age, gender, photoUrl, about, skills } = req.body;

  if (age && age > 18) throw new Error("Age must be at least 18");

  if (gender && !["male", "female", "other"].includes(gender.toLowerCase()))
    throw new Error(`${gender} is not a valid gender`);

  if (photoUrl && !isURL(photoUrl)) throw new Error("Invalid Photo URL");

  if (about && about?.length && about?.length > 250)
    throw new Error("About section can't exceed 250 characters");

  if (skills && skills?.length && skills?.length > 10)
    throw new Error("Skills must be between 1 and 10 items");
};

module.exports = {
  validateLoginData,
  validateSignupData,
  validateEditProfileData,
};
