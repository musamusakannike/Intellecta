const User = require("../models/user.model");
const { error, success } = require("../util/response.util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { name, email, password, expoPushToken } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return error({ res, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      expoPushToken,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    const responseUser = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
    success({
      res,
      message: "User registered successfully",
      statusCode: 201,
      data: { token, user: responseUser },
    });
  } catch (error) {
    error;
  }
};

module.exports = {
  register,
};
