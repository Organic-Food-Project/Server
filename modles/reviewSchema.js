const mongoose = require("mongoose");
const commentsSchema = mongoose.Schema(
  {
    userID: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
    productID: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Product",
    },
    comment: { type: String, required: true },
    rate: { type: Number, default: 5, required: true },
  },
  { timestamps: true }
);
commentsSchema.pre(/^find/, async function () {
  this.populate({ path: "productID", select: "_id name" });
  this.populate({
    path: "userID",
    select: "_id firstName lastName Profile_Image_URL",
  });
});
exports.reviews = mongoose.model("review", commentsSchema);
