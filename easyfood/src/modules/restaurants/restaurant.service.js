const prisma = require("../../database/prisma");
const activityService = require("../shared/activity.service");
const notificationService = require("../shared/notification.service");

async function listRestaurants() {
  return prisma.restaurant.findMany({
    orderBy: {
      id: "desc"
    }
  });
}

async function createRestaurant(data, owner) {
  const restaurant = await prisma.restaurant.create({
    data: {
      name: data.name.trim(),
      category: data.category.trim(),
      rating: data.rating ? Number(data.rating) : 0,
      ownerId: owner.id
    }
  });

  // Efeitos secundários não impedem o cadastro principal do restaurante.
  await Promise.allSettled([
    activityService.log("RESTAURANT_CREATED", `Restaurante: ${restaurant.name}; dono: ${owner.email}`),
    notificationService.restaurantCreated({ restaurant, owner })
  ]);

  return restaurant;
}

module.exports = {
  listRestaurants,
  createRestaurant
};
