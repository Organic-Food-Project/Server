const AppError = require("../utils/AppError");
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_API,
  privateKey: process.env.IMAGEKIT_PRIVATE_API,
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
});

const UploadImage = (isMultipleFiles) => {
  return async (req, res, next) => {
    try {
      if (
        (!isMultipleFiles && !req.file) ||
        (isMultipleFiles && (!req.files || req.files.length === 0))
      ) {
        throw new AppError("Please Make Sure You Add image/images", 400);
      }

      const files = isMultipleFiles ? req.files : [req.file];
      const uploadPromises = files.map((file) => {
        return imagekit.upload({
          file: file.buffer,
          fileName: `${Date.now()}_${file.originalname}`,
          folder: "uploads",
        });
      });
      const results = await Promise.all(uploadPromises);
      req.images = results.map((r) => r.url);
      next();
    } catch (err) {
      console.error("ImageKit Error\n");
      next(err);
    }
  };
};

module.exports = UploadImage;
