const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não informado" });
  }

  const token = authorization.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.sub,
      email: payload.email
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

module.exports = authenticate;
