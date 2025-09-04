import { PrismaClient, Patient, VitalSigns } from '@prisma/client';

const prisma = new PrismaClient();

export class PatientRepository {
  async create(patientData: {
    name: string;
    age: number;
    condition: string;
    photoUrl?: string;
    deviceId?: string;
    transmitterId?: string;
  }): Promise<Patient> {
    return prisma.patient.create({
      data: patientData,
    });
  }

  async findAll(): Promise<Patient[]> {
    return prisma.patient.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Patient | null> {
    return prisma.patient.findUnique({
      where: { id },
      include: {
        vitalSigns: {
          orderBy: {
            timestamp: 'desc',
          },
          take: 20, // Get last 20 vital signs
        },
      },
    });
  }

  async findByTransmitterId(transmitterId: string): Promise<Patient | null> {
    return prisma.patient.findFirst({
      where: { transmitterId },
    });
  }

  async findByTransmitterIdWithIdOnly(transmitterId: string): Promise<{id: string} | null> {
    return prisma.patient.findFirst({
      where: { transmitterId },
      select: { id: true }
    });
  }

  async findByDeviceId(deviceId: string): Promise<Patient | null> {
    return prisma.patient.findUnique({
      where: { deviceId },
    });
  }

  async update(id: string, data: Partial<Patient>): Promise<Patient> {
    return prisma.patient.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Patient> {
    return prisma.patient.delete({
      where: { id },
    });
  }

  async addVitalSigns(patientId: string, vitalSignsData: {
    heartRate: number;
    oxygenSaturation: number;
    temperature: number;
  }): Promise<VitalSigns> {
    // Also update the patient's last transmission and current vitals
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        lastTransmission: new Date(),
        transmissionsCount: {
          increment: 1,
        },
        currentHeartRate: vitalSignsData.heartRate,
        currentOxygenSaturation: vitalSignsData.oxygenSaturation,
        currentTemperature: vitalSignsData.temperature,
      },
    });

    return prisma.vitalSigns.create({
      data: {
        heartRate: vitalSignsData.heartRate,
        oxygenSaturation: vitalSignsData.oxygenSaturation,
        temperature: vitalSignsData.temperature,
        patientId,
      },
    });
  }

  async getVitalSignsHistory(patientId: string, limit: number = 100): Promise<VitalSigns[]> {
    return prisma.vitalSigns.findMany({
      where: { patientId },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });
  }
  
  // The getPatientStats can be implemented later if needed
}