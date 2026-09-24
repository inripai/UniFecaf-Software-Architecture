const restaurantService = require("./restaurant.service");

async function list(req, res) {
  try {
    const restaurants = await restaurantService.listRestaurants();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Não foi possível buscar os restaurantes" });
  }
}

async function create(req, res) {
  const { name, category, rating } = req.body;

  if (!name || !category) {
    return res.status(400).json({
      error: "Nome e categoria são obrigatórios"
    });
  }

  try {
    const restaurant = await restaurantService.createRestaurant({
      name,
      category,
      rating
    });

    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: "Não foi possível cadastrar o restaurante" });
  }
}

module.exports = {
  list,
  create
};
