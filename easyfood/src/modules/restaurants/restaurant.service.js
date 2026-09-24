const prisma = require("../../database/prisma");

async function listRestaurants() {
  return prisma.restaurant.findMany({
    orderBy: {
      id: "desc"
    }
  });
}

async function createRestaurant(data) {
  return prisma.restaurant.create({
    data: {
      name: data.name,
      category: data.category,
      rating: data.rating ? Number(data.rating) : 0
    }
  });
}

module.exports = {
  listRestaurants,
  createRestaurant
};
