const Response = async (res, statusCode, info) => {
  res.status(statusCode).json({
    data: info,
  });
};

module.exports = Response;
