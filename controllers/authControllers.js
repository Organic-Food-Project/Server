const User = require("../modles/userSchema");
const AppError = require("../utils/AppError");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
exports.signup = async (req, res , next) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new AppError("This Email Already Exists.", 400);
    }
    if (confirmPassword !== password) {
      throw new AppError("Make Sure Passwords Match!", 400);
    }
    const newUser = await User.create({
      email,
      password,
    });
    res.status(201).json({ message: "User Created!", newUser });
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Email Or Password Are not Correct", 404);
    }
    const decode = await bcrypt.compare(password, user.password);
    if (!decode) {
      throw new AppError("Email Or Password Are not Correct!", 404);
    }
    const token = await JWT.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({ message: "Loged In", token });
  } catch (err) {
    next(err);
  }
};
exports.protect = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw new AppError("Please Provide Token", 400);
    }
    const confirm = await JWT.verify(token, process.env.JWT_SECRET);
    if (!confirm) {
      throw new AppError("Not Allowed , Please Re-login.", 400);
    }
    const user = await User.findOne({ email: confirm.email });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
