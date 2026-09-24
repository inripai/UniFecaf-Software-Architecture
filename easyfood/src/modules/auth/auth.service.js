const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../database/prisma");

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

module.exports = {
  register,
  login
};
