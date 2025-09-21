const User = require("../modles/userSchema");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
require("dotenv").config();
exports.getallusers = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role === "admin") {
      res.status(200).json({ users: await User.find() });
    } else {
      throw new AppError("You Are Not Allowed To view This.", 400);
    }
  } catch (err) {
    next(err);
  }
};
exports.getUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};

exports.updateuser = async (req, res, next) => {
  try {
    const allowedFileds = ["firstName", "lastName", "email", "Phone_Number"];
    let updates = {};
    for (field of allowedFileds) {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    }
    const user = req.user;

    if (!user) {
      throw new AppError("User Not Found.");
    }
    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      updates,
      { new: true }
    );
    res
      .status(201)
      .json({ message: "User Data Updated Successfuly.", updatedUser });
  } catch (err) {
    next(err);
  }
};

exports.UpdatePassword = async (req, res, next) => {
  try {
    const { currentPassword, NewPassword, confirmPassword } = req.body;
    let user = await User.findOne({ email: req.user.email });
    if (!user) {
      throw new AppError("User Not Found.", 404);
    }
    const decode = await bcrypt.compare(currentPassword, user.password);
    if (!decode || NewPassword !== confirmPassword) {
      throw new AppError("Make Sure All Passwords Are Correct.", 400);
    }
    const hashedPassword = await bcrypt.hash(
      NewPassword,
      parseInt(process.env.SALT_FOR_PASSWORD)
    );
    user = await User.findOneAndUpdate(
      { email: req.user.email },
      { password: hashedPassword }
    );
    res.status(201).json({ message: "Password Updated Successfuly." });
  } catch (err) {
    next(err);
  }
};
exports.UpdateImage = async (req, res, next) => {};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ email: req.user.email });
    if (!user) {
      throw new AppError("Can't Delete This user.", 400);
    }
    res.status(200).json({ message: "User Deleted Successfuly." });
  } catch (err) {
    next(err);
  }
};

exports.comment = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
