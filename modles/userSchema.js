const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: false },
    lastNmae: { type: String, required: false },
    email: {
      type: string,
      required: [true, "Email is Required."],
      unique: true,
    },
    Phone_Number: { type: String, required: false , default:"+20 1020153016"},
    password: { type: String, required: [true, , "Password is Required."] },
    ImageURL: { type: String, required: false },
    history: { type: Object, required: false },
    token: { type: String },
  },
  { timestamp: true }
);

userSchema.pre("save", (next) => {
  if (!this.isModified("password")) return next();
  bcrypt.hashSync(this.password, 12);
  next();
});

const User = mongoose.module("User", userSchema);

module.exports = User;
