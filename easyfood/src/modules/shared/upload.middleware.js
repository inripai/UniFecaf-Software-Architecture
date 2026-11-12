const multer = require("multer");

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error("Envie uma imagem JPEG, PNG ou WebP");
      error.code = "INVALID_IMAGE_TYPE";
      return callback(error);
    }

    return callback(null, true);
  }
});

module.exports = upload;
