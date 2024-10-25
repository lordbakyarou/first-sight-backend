const mongoose = require("mongoose");
const validate = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
      validate(value) {
        if (!validate.isAlpha(value)) {
          throw new Error("String can only contains (a-zA-Z) letters");
        }
      },
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      trim: true,
      validate(value) {
        if (!validate.isAlpha(value)) {
          throw new Error("String can only contains (a-zA-Z) letters");
        }
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validate.isEmail(value)) {
          throw new Error("Enter valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      validate(value) {
        if (!validate.isStrongPassword(value)) {
          throw new Error("Please enter strong password");
        }
      },
    },
    age: {
      type: Number,
      min: [18, "You must be 18+ to signup"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: (props) =>
          `${props.value} is not supported, Gender must be "male" or "female"}`,
      },
    },
    photoURL: {
      type: String,
      validate(value) {
        if (!validate.isURL(value)) {
          throw new Error("Image URL is not correct");
        }
      },
    },
    aboutMe: {
      type: String,
      default: "Default about the user",
      maxLength: 500,
    },
    skills: {
      type: Array,
    },
    location: {
      type: String,
      minLength: 4,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
