/*
  Warnings:

  - You are about to drop the column `oxygenSat` on the `vital_signs` table. All the data in the column will be lost.
  - Added the required column `oxygenSaturation` to the `vital_signs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_vital_signs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "heartRate" INTEGER NOT NULL,
    "oxygenSaturation" INTEGER NOT NULL,
    "temperature" REAL NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vital_signs_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_vital_signs" ("heartRate", "id", "patientId", "temperature", "timestamp", "oxygenSaturation") SELECT "heartRate", "id", "patientId", "temperature", "timestamp", "oxygenSat" FROM "vital_signs";
DROP TABLE "vital_signs";
ALTER TABLE "new_vital_signs" RENAME TO "vital_signs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
