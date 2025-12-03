const AppError = require("../utils/AppError");
const Review = require("../modles/reviewSchema");
exports.Addreview = async (req, res, next) => {
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

exports.getAllReview = async (req, res, next) => {
  const { productID } = req.body || {};
  if (!productID) {
    return next(
      new AppError("please provide the productID you want the reviews of", 400)
    );
  }
  const revs = await Review.find({ productID });
  if (!revs) {
    return next(new AppError("No reviews found for this product", 400));
  }
  res.status(200).json({ status: "success", data: revs });
};
exports.deleteReview = async (req, res, next) => {
  const { revID } = req.body || {};
  if (!revID) {
    return next(
      new AppError("please provide the revID you want to delete", 400)
    );
  }
  const deletedProduct = await Review.findOneAndDelete({ _id: revID });
  if (!deletedProduct) {
    return next(new AppError("review not found make sure ID is correct", 404));
  }
  res.status(200).json({ data: "deleted successfuly" });
};
