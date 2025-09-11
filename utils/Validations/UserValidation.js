const joi = require("joi");

exports.SignUpSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().required(),
});
exports.loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});
exports.UpdateUserSchema = joi.object({
  firstName: joi.string().optional(),
  lastName: joi.string().optional(),
  email: joi.string().email().optional(),
  Phone_Number: joi.string().max(13).optional(),
});
exports.UpdateImage = joi.object({
  ImageURL: joi.string().optional(),
});

exports.UpdatePasswordSchema = joi.object({
  currentPassword: joi.string().required(),
  NewPassword: joi.string().required(),
  confirmPassword: joi.string().required(),
});
