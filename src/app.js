const express = require("express");
const connectDB = require("../config/database");
const User = require("./models/user");
const app = express();

//middlewares
app.use(express.json());

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
  const { firstName, lastName, email, password } = req.body;

  const user = new User(req.body);

  try {
    await user.save();
    res.status(201).json("User created");
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error " + error.message);
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
