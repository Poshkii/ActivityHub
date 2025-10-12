-- CreateTable
CREATE TABLE "FavoritePlace" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firebaseUid" TEXT NOT NULL,
    "placeName" TEXT NOT NULL,
    "placeType" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "address" TEXT,
    "rating" INTEGER,
    "savedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firebaseUid" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "weatherCondition" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "FavoritePlace_firebaseUid_idx" ON "FavoritePlace"("firebaseUid");

-- CreateIndex
CREATE INDEX "UserActivity_firebaseUid_idx" ON "UserActivity"("firebaseUid");
