const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_API,
  privateKey: process.env.IMAGEKIT_PRIVATE_API,
  urlEndpoint: process.env.IMAGEKIT_ENDPOINT,
});

async function UploadImage(req) {
  let files = [];

  if (req.files && Array.isArray(req.files)) {
    files = req.files;
  } else if (req.file) {
    files = [req.file];
  }
  const uploadPromises = files.map((file) => {
    return imagekit.upload({
      file: file.buffer,
      fileName: `${Date.now()}_${file.originalname}`,
      folder: "uploads",
    });
  });
  const results = await Promise.all(uploadPromises);
  return results.map((r) => r.url);
}

module.exports = UploadImage;
