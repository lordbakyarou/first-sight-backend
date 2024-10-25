const validate = require("validator");

const validationSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validate.isEmail(email)) {
    throw new Error("Not valid email");
  } else if (!validate.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

module.exports = validationSignUpData;
