-- Relaciona novos restaurantes ao usuário que os cadastrou. A coluna é opcional
-- para que instalações que já tenham restaurantes possam migrar sem perder dados.
ALTER TABLE "Restaurant" ADD COLUMN "ownerId" INTEGER;

CREATE TABLE "Dish" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "restaurantId" INTEGER NOT NULL,

    CONSTRAINT "Dish_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Dish_restaurantId_idx" ON "Dish"("restaurantId");
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

ALTER TABLE "Restaurant"
  ADD CONSTRAINT "Restaurant_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Dish"
  ADD CONSTRAINT "Dish_restaurantId_fkey"
  FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
