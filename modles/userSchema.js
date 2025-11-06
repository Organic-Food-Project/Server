const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const userSchema = mongoose.Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    email: {
      type: String,
      required: [true, "Email is Required."],
      unique: true,
    },
    Phone_Number: { type: String, default: "" },
    password: { type: String, required: [true, "Password is Required."] },
    Profile_Image_URL: { type: String, default: "" },
    purchase_history: { type: Array, default: [] },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    Cart: { type: Array, default: [] },
    WishList: { type: Array, default: [] },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(
    this.password,
    parseInt(process.env.SALT_FOR_PASSWORD)
  );
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
