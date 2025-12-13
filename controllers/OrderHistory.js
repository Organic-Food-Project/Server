const { appendFile } = require("fs");
const Payment = require("../modles/paymentSchema");
const AppError = require("../utils/AppError");
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

exports.getOrderById = async (req, res, next) => {
  try {
    const { orderid } = req.params || {};
    if (!orderid) {
      throw new AppError("make sure to add orderid parameter", 400);
    }
    if (!req.user.purchase_history.includes(orderid)) {
      throw new AppError("you don't own this order", 401);
    }
    const order = await Payment.findById(orderid);
    if (!order) {
      throw new AppError("Order Not Found", 404);
    }
    res.status(200).json({ data: order });
  } catch (error) {
    next(error);
  }
};
