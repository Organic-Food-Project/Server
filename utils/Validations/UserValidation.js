const joi = require("joi");

exports.CreatUserSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().required(),
});
exports.loginSchema = CreatUserSchema.fork(["email", "password"]);
exports.UpdateUserSchema = joi.object({
  firstName: joi.string().optional(),
  lastName: joi.string().optional(),
  email: joi.string().email().optional(),
  Phone_Number: joi.string().max(13).startswith("+").optional(),
});
exports.UpdateImage = joi.object({
  ImageURL: joi.string().optional(),
});

exports.UpdatePasswordSchema = joi.object({
  currentPassword: joi.string().required(),
  NewPassword: joi.string().required(),
  confirmPassword: joi.string().required(),
});
