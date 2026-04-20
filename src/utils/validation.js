const isStrongPassword = require("validator/lib/isStrongPassword");
const isEmail = require("validator/lib/isEmail");

const validationSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("");
  }
  if (!isEmail(emailId)) {
    throw new Error("Enter a valid email id");
  }
  if (isStrongPassword(password)) {
    throw new Error("Enter a valid password");
  }
};

const validationLoginData = (req) => {
  const { emailId, password } = req.body;

  if (!emailId || !password || !isEmail(emailId)) {
    throw new Error("Invalid credential");
  }
};

module.exports = { validationSignupData, validationLoginData };
