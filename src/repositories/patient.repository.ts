import { PrismaClient, Patient, VitalSigns } from '@prisma/client';

const prisma = new PrismaClient();

export class PatientRepository {
  async create(patientData: {
    name: string;
    age: number;
    condition: string;
    photoUrl?: string;
    deviceId?: string;
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
    oxygenSat: number;
    systolic: number;
    diastolic: number;
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
        currentOxygenSat: vitalSignsData.oxygenSat,
        currentSystolic: vitalSignsData.systolic,
        currentDiastolic: vitalSignsData.diastolic,
        currentTemperature: vitalSignsData.temperature,
      },
    });

    return prisma.vitalSigns.create({
      data: {
        ...vitalSignsData,
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