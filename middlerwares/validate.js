const validate = (schema) => {
  return async (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) next(error); //res.status(400).json({ Error: error.details[0].message });
    next();
  };
};

module.exports = validate;
