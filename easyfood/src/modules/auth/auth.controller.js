const authService = require("./auth.service");

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Nome, e-mail e senha são obrigatórios"
    });
  }

  try {
    const user = await authService.register({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Este e-mail já foi cadastrado" });
    }

    res.status(500).json({ error: "Não foi possível cadastrar o usuário" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "E-mail e senha são obrigatórios"
    });
  }

  try {
    const result = await authService.login({ email, password });

    if (!result) {
      return res.status(401).json({ error: "E-mail ou senha inválidos" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Não foi possível fazer login" });
  }
}

function me(req, res) {
  res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  me
};
