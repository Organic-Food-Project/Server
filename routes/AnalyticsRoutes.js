const Reviews = require("../modles/reviewSchema").reviews;
const Payment = require("../modles/paymentSchema");
const Router = require("express").Router();

Router.get("/", async function (req, res, next) {
  try {
    const Years = parseInt(new Date().getFullYear()) - 2025 + 1;
    const Qualified_Team_Member = 2;
    const [Happy_Customers, Total_Orders] = await Promise.all([
      await Reviews.countDocuments({ rate: { $gte: 3 } }),
      await Payment.countDocuments(),
    ]);
    res
      .status(200)
      .json({ Years, Happy_Customers, Qualified_Team_Member, Total_Orders });
  } catch (error) {
    next(error);
  }
});

module.exports = Router;
