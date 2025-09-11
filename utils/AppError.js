module.exports = class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
  static validate(schema) {
    return async (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) res.status(400).json({ Error: error.details[0].message });
      next();
    };
  }
};
