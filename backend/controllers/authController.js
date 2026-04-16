const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      message: "user registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Server error",
    });
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      "mysecretkey",
      {
        expiresIn : "1h"
      }
    )

    res.json({
        message : "login successfully...",
        token : token,
    });
  } catch (error) {
    res.status(400).json({
        message : "Server error",
    });

    console.log(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
