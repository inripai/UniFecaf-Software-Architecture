const prisma = require("../../database/prisma");
const activityService = require("../shared/activity.service");
const imageService = require("../shared/image.service");

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parseId(value) {
  const id = Number(value);

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw createHttpError(400, "Identificador inválido");
  }

  return id;
}

function validateDish(data) {
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const category = typeof data.category === "string" ? data.category.trim() : "";
  const description = typeof data.description === "string" ? data.description.trim() : "";
  const price = Number(data.price);

  if (!name) throw createHttpError(400, "Nome do prato é obrigatório");
  if (!category) throw createHttpError(400, "Categoria do prato é obrigatória");
  if (!description) throw createHttpError(400, "Descrição do prato é obrigatória");
  if (data.price === "" || data.price === null || data.price === undefined || !Number.isFinite(price) || price < 0) {
    throw createHttpError(400, "Preço do prato é inválido");
  }

  return { name, category, description, price: price.toFixed(2) };
}

function ensureOwnership(restaurant, userId) {
  if (!restaurant.ownerId || restaurant.ownerId !== userId) {
    throw createHttpError(403, "Você não tem permissão para gerenciar este restaurante");
  }
}

async function logActivity(action, details) {
  try {
    await activityService.log(action, details);
  } catch (error) {
    // Auditoria não pode desfazer uma alteração de cardápio já persistida.
    console.error("Não foi possível registrar a atividade:", error.message);
  }
}

async function getRestaurant(restaurantId) {
  const id = parseId(restaurantId);
  const restaurant = await prisma.restaurant.findUnique({ where: { id } });

  if (!restaurant) throw createHttpError(404, "Restaurante não encontrado");
  return restaurant;
}

async function getDishWithRestaurant(dishId) {
  const id = parseId(dishId);
  const dish = await prisma.dish.findUnique({
    where: { id },
    include: { restaurant: true }
  });

  if (!dish) throw createHttpError(404, "Prato não encontrado");
  return dish;
}

async function createDish(restaurantId, data, userId) {
  const restaurant = await getRestaurant(restaurantId);
  ensureOwnership(restaurant, userId);

  const dish = await prisma.dish.create({
    data: { ...validateDish(data), restaurantId: restaurant.id, imageUrl: null }
  });

  await logActivity("DISH_CREATED", `Prato: ${dish.name}; restaurante: ${restaurant.name}`);
  return dish;
}

async function listDishes(restaurantId) {
  const restaurant = await getRestaurant(restaurantId);
  return prisma.dish.findMany({
    where: { restaurantId: restaurant.id },
    orderBy: { id: "asc" }
  });
}

async function getDish(dishId) {
  const dish = await getDishWithRestaurant(dishId);
  const { restaurant, ...result } = dish;
  return result;
}

async function updateDish(dishId, data, userId) {
  const dish = await getDishWithRestaurant(dishId);
  ensureOwnership(dish.restaurant, userId);

  const updatedDish = await prisma.dish.update({
    where: { id: dish.id },
    data: validateDish(data)
  });

  await logActivity("DISH_UPDATED", `Prato: ${updatedDish.name}; restaurante: ${dish.restaurant.name}`);
  return updatedDish;
}

async function deleteDish(dishId, userId) {
  const dish = await getDishWithRestaurant(dishId);
  ensureOwnership(dish.restaurant, userId);

  await prisma.dish.delete({ where: { id: dish.id } });
  await logActivity("DISH_DELETED", `Prato: ${dish.name}; restaurante: ${dish.restaurant.name}`);
}

async function updateDishImage(dishId, file, userId) {
  const dish = await getDishWithRestaurant(dishId);
  ensureOwnership(dish.restaurant, userId);

  const imageUrl = await imageService.processDishImage(file);
  let updatedDish;

  try {
    updatedDish = await prisma.dish.update({
      where: { id: dish.id },
      data: { imageUrl }
    });
  } catch (error) {
    await imageService.removeStoredImage(imageUrl);
    throw error;
  }

  try {
    await imageService.removeStoredImage(dish.imageUrl);
  } catch (error) {
    console.error("Não foi possível remover a imagem anterior do prato:", error.message);
  }

  await logActivity("DISH_IMAGE_UPDATED", `Prato: ${updatedDish.name}; restaurante: ${dish.restaurant.name}`);
  return updatedDish;
}

module.exports = { createDish, listDishes, getDish, updateDish, deleteDish, updateDishImage };
