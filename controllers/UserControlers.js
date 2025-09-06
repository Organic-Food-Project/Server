const User = require("../modles/userSchema");
const AppError = require("../utils/AppError");

exports.getUser = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User Not Found!", 404);
  }
  res.status(200).json({ user });
};

exports.updateuser = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User Not Found.");
  }
  res.status(201).json({ message: "User Data Updated Successfuly." });
};

exports.UpdatePassword = async (req, res) => {
  const { currentPassword, NewPassword, confirmPassword } = req.body;
  const id = req.params.id;
  let user = await User.findByID(id);
  if (!user) {
    throw new AppError("User Not Found.", 404);
  }

  if (currentPassword !== user.password && NewPassword !== confirmPassword) {
    throw new AppError("Make Sure All Passwords Are Correct.", 400);
  }
  user = await User.findOneAndUpdate(id, { password: NewPassword });
  res.status(201).json({ message: "Password Updated Successfuly." });
};
exports.UpdateImage = async (req, res) => {};

exports.deleteUser = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOnewAndDelete(email);
  if (!user) {
    throw new AppError("Can't Delete THis user.", 400);
  }
  res.status(200).json({ message: "User Deleted Successfuly." });
};
