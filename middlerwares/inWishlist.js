const inWishlist = (req, obj) => {
  return req.user?.WishList?.includes(obj._id) || false;
};

module.exports = inWishlist;
