const User = require("../modles/userSchema");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt");
require("dotenv").config();
exports.getUser = async (req, res) => {
  res.status(200).json({ user: req.body });
};

exports.updateuser = async (req, res) => {
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
};

exports.UpdatePassword = async (req, res) => {
  const { currentPassword, NewPassword, confirmPassword } = req.body;
  let user = await User.findOne({ email: req.user.email });
  if (!user) {
    throw new AppError("User Not Found.", 404);
  }
  const decode = await bcrypt.compare(currentPassword, user.password);
  if (!decode || NewPassword !== confirmPassword) {
    throw new AppError("Make Sure All Passwords Are Correct.", 400);
  }
  const hashedPassword = bcrypt.hash(
    NewPassword,
    process.env.SALT_FOR_PASSWORD
  );
  user = await User.findOneAndUpdate(
    { email: req.user.email },
    { password: hashedPassword }
  );
  res.status(201).json({ message: "Password Updated Successfuly." });
};
exports.UpdateImage = async (req, res) => {};

exports.deleteUser = async (req, res) => {
  const user = await User.findOneAndDelete({ email: req.user.email });
  if (!user) {
    throw new AppError("Can't Delete This user.", 400);
  }
  res.status(200).json({ message: "User Deleted Successfuly." });
};
