/*
  Warnings:

  - A unique constraint covering the columns `[deviceId]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN "deviceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "patients_deviceId_key" ON "patients"("deviceId");
