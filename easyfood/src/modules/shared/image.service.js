const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");

const publicDirectory = path.resolve(__dirname, "../../../public");
const uploadsDirectory = path.join(publicDirectory, "uploads");

function createImageError() {
  const error = new Error("O arquivo enviado não é uma imagem válida");
  error.statusCode = 422;
  return error;
}

async function processImage(file, folder) {
  if (!file || !Buffer.isBuffer(file.buffer)) {
    const error = new Error("Nenhuma imagem foi enviada");
    error.statusCode = 400;
    throw error;
  }

  const relativeDirectory = path.posix.join("/uploads", folder);
  const destinationDirectory = path.join(uploadsDirectory, folder);
  const filename = `${crypto.randomUUID()}.webp`;
  const destination = path.join(destinationDirectory, filename);

  await fs.mkdir(destinationDirectory, { recursive: true });

  try {
    await sharp(file.buffer)
      .rotate()
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(destination);
  } catch (error) {
    await fs.rm(destination, { force: true });
    throw createImageError();
  }

  return path.posix.join(relativeDirectory, filename);
}

async function removeStoredImage(imageUrl) {
  if (typeof imageUrl !== "string" || !imageUrl.startsWith("/uploads/")) {
    return;
  }

  const filePath = path.resolve(publicDirectory, `.${imageUrl}`);

  if (!filePath.startsWith(`${uploadsDirectory}${path.sep}`)) {
    return;
  }

  await fs.rm(filePath, { force: true });
}

function processProfileImage(file) {
  return processImage(file, "profiles");
}

function processDishImage(file) {
  return processImage(file, "dishes");
}

module.exports = { processProfileImage, processDishImage, removeStoredImage };
