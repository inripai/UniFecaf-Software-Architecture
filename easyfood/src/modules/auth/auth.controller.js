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

async function me(req, res) {
  try {
    const user = await authService.getById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Não foi possível buscar o usuário" });
  }
}

async function uploadProfileImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "Envie uma imagem no campo 'image'" });
  }

  try {
    const user = await authService.updateProfileImage(req.user.id, req.file);
    return res.json({ user });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : "Não foi possível processar a imagem de perfil"
    });
  }
}

module.exports = {
  register,
  login,
  me,
  uploadProfileImage
};
