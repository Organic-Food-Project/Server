const Response = async (res, statusCode, info) => {
  res.status(statusCode).json({
    data: info,
    meta: {
      limit: 15,
      total: 100,
    },
  });
};

module.exports = Response;
