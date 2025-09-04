/*
  Warnings:

  - You are about to drop the column `currentDiastolic` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `currentSystolic` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `diastolic` on the `vital_signs` table. All the data in the column will be lost.
  - You are about to drop the column `systolic` on the `vital_signs` table. All the data in the column will be lost.

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
    "currentOxygenSat" INTEGER,
    "currentTemperature" REAL
);
INSERT INTO "new_patients" ("age", "condition", "createdAt", "currentHeartRate", "currentOxygenSat", "currentTemperature", "deviceId", "id", "lastTransmission", "name", "photoUrl", "transmissionsCount", "updatedAt") SELECT "age", "condition", "createdAt", "currentHeartRate", "currentOxygenSat", "currentTemperature", "deviceId", "id", "lastTransmission", "name", "photoUrl", "transmissionsCount", "updatedAt" FROM "patients";
DROP TABLE "patients";
ALTER TABLE "new_patients" RENAME TO "patients";
CREATE UNIQUE INDEX "patients_deviceId_key" ON "patients"("deviceId");
CREATE TABLE "new_vital_signs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "heartRate" INTEGER NOT NULL,
    "oxygenSat" INTEGER NOT NULL,
    "temperature" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vital_signs_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_vital_signs" ("heartRate", "id", "oxygenSat", "patientId", "temperature", "timestamp") SELECT "heartRate", "id", "oxygenSat", "patientId", "temperature", "timestamp" FROM "vital_signs";
DROP TABLE "vital_signs";
ALTER TABLE "new_vital_signs" RENAME TO "vital_signs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
