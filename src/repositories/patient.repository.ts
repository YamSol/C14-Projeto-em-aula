import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PatientRepository {
  // For now, we'll use mock data since there are issues with Prisma types
  // This will be replaced with actual database operations once Prisma is properly configured
  
  private mockPatients: Array<{
    id: string;
    name: string;
    age: number;
    condition: string;
    photoUrl: string | null;
    transmissionsCount: number;
    lastTransmission: Date;
    createdAt: Date;
    updatedAt: Date;
    currentHeartRate: number;
    currentOxygenSat: number;
    currentSystolic: number;
    currentDiastolic: number;
    currentTemperature: number;
    vitalSigns: any[];
  }> = [
    {
      id: 'patient-1',
      name: 'Maria Santos',
      age: 65,
      condition: 'Hipertensão arterial e diabetes tipo 2',
      photoUrl: null,
      transmissionsCount: 247,
      lastTransmission: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
      currentHeartRate: 78,
      currentOxygenSat: 97,
      currentSystolic: 140,
      currentDiastolic: 90,
      currentTemperature: 36.8,
      vitalSigns: []
    },
    {
      id: 'patient-2',
      name: 'José Silva',
      age: 52,
      condition: 'Doença coronariana estável',
      photoUrl: null,
      transmissionsCount: 189,
      lastTransmission: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date(),
      currentHeartRate: 82,
      currentOxygenSat: 98,
      currentSystolic: 130,
      currentDiastolic: 85,
      currentTemperature: 37.1,
      vitalSigns: []
    },
    {
      id: 'patient-3',
      name: 'Ana Oliveira',
      age: 28,
      condition: 'Asma brônquica',
      photoUrl: null,
      transmissionsCount: 95,
      lastTransmission: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date(),
      currentHeartRate: 88,
      currentOxygenSat: 95,
      currentSystolic: 110,
      currentDiastolic: 70,
      currentTemperature: 36.5,
      vitalSigns: []
    },
    {
      id: 'patient-4',
      name: 'Carlos Costa',
      age: 71,
      condition: 'DPOC (Doença Pulmonar Obstrutiva Crônica)',
      photoUrl: null,
      transmissionsCount: 412,
      lastTransmission: new Date(Date.now() - 22 * 60 * 1000), // 22 minutes ago
      createdAt: new Date('2023-11-05'),
      updatedAt: new Date(),
      currentHeartRate: 92,
      currentOxygenSat: 92,
      currentSystolic: 150,
      currentDiastolic: 95,
      currentTemperature: 37.3,
      vitalSigns: []
    },
    {
      id: 'patient-5',
      name: 'Lucia Ferreira',
      age: 43,
      condition: 'Fibrilação atrial',
      photoUrl: null,
      transmissionsCount: 156,
      lastTransmission: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      createdAt: new Date('2024-01-28'),
      updatedAt: new Date(),
      currentHeartRate: 105,
      currentOxygenSat: 99,
      currentSystolic: 125,
      currentDiastolic: 80,
      currentTemperature: 36.9,
      vitalSigns: []
    }
  ];

  async create(patientData: {
    name: string;
    age: number;
    condition: string;
    photoUrl?: string;
  }) {
    const newPatient = {
      id: `patient-${Date.now()}`,
      name: patientData.name,
      age: patientData.age,
      condition: patientData.condition,
      photoUrl: patientData.photoUrl || null,
      transmissionsCount: 0,
      lastTransmission: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      currentHeartRate: 72,
      currentOxygenSat: 98,
      currentSystolic: 120,
      currentDiastolic: 80,
      currentTemperature: 36.8,
      vitalSigns: []
    };

    this.mockPatients.push(newPatient);
    return newPatient;
  }

  async findAll() {
    return this.mockPatients.map(patient => ({
      ...patient,
      vitalSigns: []
    }));
  }

  async findById(id: string) {
    const patient = this.mockPatients.find(p => p.id === id);
    if (!patient) return null;
    
    return {
      ...patient,
      vitalSigns: this.generateMockVitalSignsHistory(id)
    };
  }

  async update(id: string, data: any) {
    const index = this.mockPatients.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Patient not found');

    this.mockPatients[index] = {
      ...this.mockPatients[index],
      ...data,
      updatedAt: new Date()
    };

    return this.mockPatients[index];
  }

  async delete(id: string) {
    const index = this.mockPatients.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Patient not found');

    const patient = this.mockPatients[index];
    this.mockPatients.splice(index, 1);
    return patient;
  }

  async addVitalSigns(patientId: string, vitalSigns: {
    heartRate: number;
    oxygenSat: number;
    systolic: number;
    diastolic: number;
    temperature: number;
  }) {
    const patient = this.mockPatients.find(p => p.id === patientId);
    if (!patient) throw new Error('Patient not found');

    // Update current vital signs
    patient.currentHeartRate = vitalSigns.heartRate;
    patient.currentOxygenSat = vitalSigns.oxygenSat;
    patient.currentSystolic = vitalSigns.systolic;
    patient.currentDiastolic = vitalSigns.diastolic;
    patient.currentTemperature = vitalSigns.temperature;
    patient.lastTransmission = new Date();
    patient.transmissionsCount += 1;
    patient.updatedAt = new Date();

    return {
      id: `vital-${Date.now()}`,
      patientId,
      ...vitalSigns,
      timestamp: new Date()
    };
  }

  async getVitalSignsHistory(patientId: string, limit?: number) {
    return this.generateMockVitalSignsHistory(patientId).slice(0, limit);
  }

  async getVitalSignsStats(patientId: string) {
    const history = this.generateMockVitalSignsHistory(patientId);
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      last24h: history.filter(record => record.timestamp >= last24h),
      last7days: history.filter(record => record.timestamp >= last7days),
      lastMonth: history.filter(record => record.timestamp >= lastMonth)
    };
  }

  private generateMockVitalSignsHistory(patientId: string) {
    const patient = this.mockPatients.find(p => p.id === patientId);
    if (!patient) return [];

    const history = [];
    const now = new Date();

    // Generate 20 records over the last 7 days
    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now.getTime() - (i * 6 * 60 * 60 * 1000)); // Every 6 hours
      
      // Add some variation to base values
      const variation = () => (Math.random() - 0.5) * 0.15; // ±7.5% variation
      
      history.push({
        id: `vital-${patientId}-${i}`,
        patientId,
        heartRate: Math.round((patient.currentHeartRate || 72) * (1 + variation())),
        oxygenSat: Math.round((patient.currentOxygenSat || 98) * (1 + variation())),
        systolic: Math.round((patient.currentSystolic || 120) * (1 + variation())),
        diastolic: Math.round((patient.currentDiastolic || 80) * (1 + variation())),
        temperature: parseFloat(((patient.currentTemperature || 36.8) * (1 + variation())).toFixed(1)),
        timestamp
      });
    }

    return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}
