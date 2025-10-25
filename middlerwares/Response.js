const Response = async (res, statusCode, info, length) => {
  res.status(statusCode).json({
    results: length,
    data: info,
    meta: {
      limit: 15,
      total: 100,
    },
  });
};

module.exports = Response;
