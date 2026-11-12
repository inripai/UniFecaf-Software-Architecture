const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../database/prisma");
const imageService = require("../shared/image.service");

async function register(data) {
  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: passwordHash
    }
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

async function login(data) {
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user) {
    return null;
  }

  const passwordIsCorrect = await bcrypt.compare(data.password, user.password);

  if (!passwordIsCorrect) {
    return null;
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}

async function getById(id) {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return null;
  }

  return { id: user.id, name: user.name, email: user.email, profileImage: user.profileImage };
}

async function updateProfileImage(id, file) {
  const currentUser = await getById(id);

  if (!currentUser) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  const imageUrl = await imageService.processProfileImage(file);
  let user;

  try {
    user = await prisma.user.update({
      where: { id },
      data: { profileImage: imageUrl }
    });
  } catch (error) {
    await imageService.removeStoredImage(imageUrl);
    throw error;
  }

  try {
    await imageService.removeStoredImage(currentUser.profileImage);
  } catch (error) {
    console.error("Não foi possível remover a imagem de perfil anterior:", error.message);
  }

  return { id: user.id, name: user.name, email: user.email, profileImage: user.profileImage };
}

module.exports = {
  register,
  login,
  getById,
  updateProfileImage
};
