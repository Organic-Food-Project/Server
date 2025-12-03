const AppError = require("../utils/AppError");
const Review = require("../modles/reviewSchema");
exports.review = async (req, res, next) => {
  const { comment, produtID, rating } = req.body || {};
  if (!comment || !produtID || !rating) {
    return next(
      new AppError("Make sure to add comment , productID and rating.", 400)
    );
  }
  const user = req.user;
  if (!user.purchase_history.includes(produtID)) {
    return next(
      new AppError("you can only review items you have purchased before", 400)
    );
  }
  const rev = await Review.create({
    userID: user._id,
    produtID,
    comment,
    rate: rating,
  });
  res.status(201).json({ status: "success", data: rev });
};
