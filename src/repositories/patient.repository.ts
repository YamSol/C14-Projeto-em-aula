import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PatientRepository {
  async create(patientData: {
    name: string;
    age: number;
    condition: string;
    photoUrl?: string;
  }) {
    return prisma.patient.create({
      data: patientData,
    });
  }

  async findAll() {
    return prisma.patient.findMany({
      include: {
        vitalSigns: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  }

  async findById(id: string) {
    return prisma.patient.findUnique({
      where: { id },
      include: {
        vitalSigns: {
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    });
  }

  async update(id: string, data: any) {
    return prisma.patient.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.patient.delete({
      where: { id }
    });
  }

  async addVitalSigns(patientId: string, vitalSigns: {
    heartRate: number;
    oxygenSat: number;
    systolic: number;
    diastolic: number;
    temperature: number;
  }) {
    // Create new vital signs record
    const newVitalSigns = await prisma.vitalSigns.create({
      data: {
        ...vitalSigns,
        patientId
      }
    });

    // Update patient's current vital signs and transmission count
    await prisma.patient.update({
      where: { id: patientId },
      data: {
        currentHeartRate: vitalSigns.heartRate,
        currentOxygenSat: vitalSigns.oxygenSat,
        currentSystolic: vitalSigns.systolic,
        currentDiastolic: vitalSigns.diastolic,
        currentTemperature: vitalSigns.temperature,
        lastTransmission: new Date(),
        transmissionsCount: {
          increment: 1
        }
      }
    });

    return newVitalSigns;
  }

  async getVitalSignsHistory(patientId: string, limit?: number) {
    return prisma.vitalSigns.findMany({
      where: { patientId },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    });
  }

  async getVitalSignsStats(patientId: string) {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [last24hData, last7daysData, lastMonthData] = await Promise.all([
      prisma.vitalSigns.findMany({
        where: {
          patientId,
          timestamp: {
            gte: last24h
          }
        },
        orderBy: { timestamp: 'desc' }
      }),
      prisma.vitalSigns.findMany({
        where: {
          patientId,
          timestamp: {
            gte: last7days
          }
        },
        orderBy: { timestamp: 'desc' }
      }),
      prisma.vitalSigns.findMany({
        where: {
          patientId,
          timestamp: {
            gte: lastMonth
          }
        },
        orderBy: { timestamp: 'desc' }
      })
    ]);

    return {
      last24h: last24hData,
      last7days: last7daysData,
      lastMonth: lastMonthData
    };
  }
}
