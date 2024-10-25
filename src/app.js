const express = require("express");
const connectDB = require("../config/database");
const User = require("./models/user");
const app = express();
const validateSignUpData = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//middlewares
app.use(express.json());
app.use(cookieParser());

//Get user by email
app.get("/user", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user.length == 0) {
      return res.status(404).json("No user found with this email");
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
});

//FEED method to get all documents
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

//delete a user
app.delete("/delete", async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.status(200).json("User is deleted");
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

//update a user
app.patch("/user", async (req, res) => {
  const { userId, update } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, update, {
      runValidators: true,
    });

    res.status(202).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const salt = await bcrypt.genSalt(9);
    console.log(salt);

    const hashedPassword = await bcrypt.hash(req.body.password, 9);
    console.log(hashedPassword);

    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();

    res.status(201).json("User created");
  } catch (error) {
    console.log(error);
    res.status(500).json("ERROR: " + error.message);
  }
});

//Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) throw new Error("Invalid creadentials");

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

      res.cookie("token", token);
      res.status(200).json("User successfull loggedin");
    } else {
      throw new Error("Invalid creadentials");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("ERROR: " + error.message);
  }
});

app.post("/profile", async (req, res) => {
  const { token } = req.cookies;

  try {
    if (!validateToken) throw new Error("User if not signin");

    const validateToken = await jwt.verify(token, process.env.SECRET_KEY);

    console.log(validateToken);
    const user = await User.findById(validateToken._id);

    if (!user) throw new Error("User not found");

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("ERROR: " + error.message);
  }
});

//connecting DB
connectDB()
  .then(() => {
    console.log("Databse connected");
    //Creating server
    app.listen(9999, () => {
      console.log("Server is running on port 9999");
    });
  })
  .catch((err) => {
    console.log("Some error has occured while connecting to the database");
    console.log(err);
  });
