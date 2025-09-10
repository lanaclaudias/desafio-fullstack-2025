
CREATE TABLE "Brand" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);


CREATE TABLE "Store" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "brandId" INTEGER NOT NULL,
    CONSTRAINT "Store_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);


CREATE TABLE "Car" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "model" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT,
    "images" TEXT,
    "storeId" INTEGER NOT NULL,
    CONSTRAINT "Car_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);


CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");
