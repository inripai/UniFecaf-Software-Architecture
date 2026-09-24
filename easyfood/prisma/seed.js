require("dotenv").config();

const prisma = require("../src/database/prisma");

async function main() {
  await prisma.restaurant.createMany({
    data: [
      { name: "Casa do Pão", category: "Cafeteria", rating: 4.6 },
      { name: "Tempero da Vila", category: "Brasileira", rating: 4.4 },
      { name: "Massa Fresca", category: "Italiana", rating: 4.8 }
    ]
  });

  console.log("Restaurantes iniciais cadastrados.");
}

main()
  .catch((error) => {
    console.error("Erro ao inserir dados:", error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
