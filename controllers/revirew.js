const AppError = require("../utils/AppError");
const Products = require("../modles/porductSchema").Products;
const Review = require("../modles/reviewSchema").reviews;
const Payment = require("../modles/paymentSchema");
exports.Addreview = async (req, res, next) => {
  try {
    const { comment, prID, rating } = req.body || {};
    if (!comment || !prID || !rating) {
      return next(
        new AppError("Make sure to add comment , prID and rating.", 400)
      );
    }
    const user = req.user;
    const orders = await Payment.find({ _id: { $in: user.purchase_history } });
    if (!orders.length) {
      throw new AppError(
        "review is only allowed for those who bought something before",
        401
      );
    }
    const exists = orders.some((obj) => {
      return obj.products.includes(prID);
    });
    if (!exists) {
      return next(
        new AppError("you can only review items you have purchased before", 400)
      );
    }
    const product = await Products.findById(prID);
    if (!product) {
      throw new AppError("product Not Found", 404);
    }
    const rev = await Review.create({
      userID: user._id,
      productID: prID,
      comment,
      rate: Math.abs(rating),
    });
    product.feedBack.push(rev._id);
    product.rate.total += rev.rate;
    product.rate.number_of_rates += 1;
    product.rate.avg = product.rate.total / product.rate.number_of_rates;
    await product.save();
    res.status(201).json({ status: "success", data: rev });
  } catch (error) {
    next(error);
  }
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
  try {
    const { revID } = req.body || {};
    if (!revID) {
      return next(
        new AppError("please provide the revID you want to delete", 400)
      );
    }
    const review = await Review.findById(revID);
    if (!review) {
      return next(
        new AppError("review not found make sure ID is correct", 404)
      );
    }

    if (req.user._id != review.userID && req.user.role != "admin") {
      return next(
        new AppError("you don't have permission to delete this one.", 403)
      );
    }

    const deletedReview = await Review.findOneAndDelete({ _id: review._id });
    if (!deletedReview) {
      return next(new AppError("review not found", 404));
    }
    const product = await Products.findById(deletedReview.productID);
    product.feedBack.splice(product.feedBack.indexOf(deletedReview._id), 1);
    product.rate.total -= deletedReview.rate;
    product.rate.number_of_rates -= 1;
    product.rate.avg = product.rate.total / product.rate.number_of_rates || 0;
    await product.save();
    res.status(200).json({ data: "deleted successfuly" });
  } catch (error) {
    next(error);
  }
};
