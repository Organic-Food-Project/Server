const User = require("../modles/userSchema");
const AppError = require("../utils/AppError");
const Response = require("../middlerwares/Response");
const bcrypt = require("bcrypt");
const UploadImage = require("../middlerwares/Image_kit");
const Payment = require("../modles/paymentSchema");
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
  const allowedKeys = [
    "_id",
    "firstName",
    "lastName",
    "email",
    "Phone_Number",
    "Profile_Image_URL",
    "role",
    "createdAt",
    "updatedAt",
  ];
  const user = Object.fromEntries(
    Object.entries(req.user.toObject()).filter(([key]) =>
      allowedKeys.includes(key)
    )
  );
  Response(res, 200, user);
};

exports.updateuser = async (req, res, next) => {
  try {
    const allowedFields = ["firstName", "lastName", "email", "Phone_Number"];
    let updates = {};
    for (const field of allowedFields) {
      if (req.body[field]) {
        updates[field] = req.body[field];
      }
    }
    if (Object.keys(updates).length === 0) {
      throw new AppError("No Fields To Update.", 400);
    }
    const user = req.user;

    if (!user) {
      throw new AppError("User Not Found.", 404);
    }
    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      updates,
      { new: true, runValidators: true, context: "query" }
    ).select("firstName lastName email Phone_Number");
    if (!updatedUser) {
      throw new AppError("User Not Found.", 404);
    }
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
exports.UpdateImage = async (req, res, next) => {
  const images = await UploadImage(req);
  const user = req.user;
  if (!images) {
    throw new AppError("Please Provide Profile Image", 400);
  }
  user.Profile_Image_URL = images;
};

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

exports.orderHistory = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError("sign in again");
    }
    const limit = req.query.limit * 1 || 1;
    const page = req.query.page * 1 || 1;
    const skip = (page - 1) * limit;
    let orders = Payment.find(
      {
        _id: { $in: req.user.purchase_history },
      },
      "_id createdAt total"
    );
    orders.skip(skip).limit(limit);
    if (req.query.page) {
      if (skip >= req.user.purchase_history.length) {
        res.status(200).json({
          data: [],
          meta: {
            limit,
            total: req.user.purchase_history.length,
          },
        });
      }
    }
    orders = await orders.lean();
    res.status(200).json({
      data: orders,
      meta: {
        limit,
        total: req.user.purchase_history.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
