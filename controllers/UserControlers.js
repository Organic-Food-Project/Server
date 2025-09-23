const User = require("../modles/userSchema");
const AppError = require("../utils/AppError");
const Response = require("../middlerwares/Response");
const bcrypt = require("bcrypt");
require("dotenv").config();
exports.getallusers = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      throw new AppError("You Are Not Allowed To view This.", 403);
    }
    const users = await User.find();
    Response(res, 200, users);
  } catch (err) {
    next(err);
  }
};
exports.getUser = async (req, res) => {
  Response(res, 200, req.user);
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
      throw new AppError("User Not Found.", 404);
    }
    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      updates,
      { new: true }
    );
    Response(res, 200, updatedUser);
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
    Response(res, 200, "Password Updated Successfuly.");
  } catch (err) {
    next(err);
  }
};
exports.UpdateImage = async (req, res, next) => {};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ email: req.user.email });
    if (!user) {
      throw new AppError("User Not Found.", 404);
    }
    Response(res, 200, "User Deleted Successfuly.");
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

exports.AdminDeleteUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      throw new AppError("You Are Not Allowed Here", 403);
    }
    const { email } = req.body;
    if (!email) {
      throw new AppError("Make Sure To provide the email", 400);
    }
    const targetUser = await User.findOneAndDelete({ email });
    if (!targetUser) {
      throw new AppError("User Not Found", 404);
    }
    Response(res, 200, "Target Deleted Successfuly.");
  } catch (err) {
    next(err);
  }
};
