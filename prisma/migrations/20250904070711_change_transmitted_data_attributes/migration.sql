/*
  Warnings:

  - You are about to drop the column `currentOxygenSat` on the `patients` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "condition" TEXT NOT NULL,
    "photoUrl" TEXT,
    "deviceId" TEXT,
    "transmissionsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastTransmission" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentHeartRate" INTEGER,
    "currentOxygenSaturation" INTEGER,
    "currentTemperature" REAL,
    "transmitterId" TEXT
);
INSERT INTO "new_patients" ("age", "condition", "createdAt", "currentHeartRate", "currentTemperature", "deviceId", "id", "lastTransmission", "name", "photoUrl", "transmissionsCount", "updatedAt") SELECT "age", "condition", "createdAt", "currentHeartRate", "currentTemperature", "deviceId", "id", "lastTransmission", "name", "photoUrl", "transmissionsCount", "updatedAt" FROM "patients";
DROP TABLE "patients";
ALTER TABLE "new_patients" RENAME TO "patients";
CREATE UNIQUE INDEX "patients_deviceId_key" ON "patients"("deviceId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
