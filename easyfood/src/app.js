const express = require("express");
const cors = require("cors");
const path = require("path");
const restaurantRoutes = require("./modules/restaurants/restaurant.routes");
const authRoutes = require("./modules/auth/auth.routes");
const dishRoutes = require("./modules/dishes/dish.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth", authRoutes);
app.use("/restaurants", restaurantRoutes);
app.use(dishRoutes);

app.use((error, req, res, next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "A imagem deve ter no máximo 5 MB" });
  }

  if (error.code === "INVALID_IMAGE_TYPE") {
    return res.status(415).json({ error: "Envie uma imagem JPEG, PNG ou WebP" });
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "Erro interno do servidor" });
});

module.exports = app;
