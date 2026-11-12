const dishService = require("./dish.service");

function handleError(res, error) {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    error: statusCode === 500 ? "Não foi possível concluir a operação com o prato" : error.message
  });
}

async function create(req, res) {
  try {
    const dish = await dishService.createDish(req.params.restaurantId, req.body, req.user.id);
    return res.status(201).json(dish);
  } catch (error) {
    return handleError(res, error);
  }
}

async function list(req, res) {
  try {
    return res.json(await dishService.listDishes(req.params.restaurantId));
  } catch (error) {
    return handleError(res, error);
  }
}

async function getById(req, res) {
  try {
    return res.json(await dishService.getDish(req.params.dishId));
  } catch (error) {
    return handleError(res, error);
  }
}

async function update(req, res) {
  try {
    return res.json(await dishService.updateDish(req.params.dishId, req.body, req.user.id));
  } catch (error) {
    return handleError(res, error);
  }
}

async function remove(req, res) {
  try {
    await dishService.deleteDish(req.params.dishId, req.user.id);
    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
}

async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "Envie uma imagem no campo 'image'" });
  }

  try {
    const dish = await dishService.updateDishImage(req.params.dishId, req.file, req.user.id);
    return res.json(dish);
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = { create, list, getById, update, remove, uploadImage };
