import { PatientRepository } from '../repositories/patient.repository';
import type { PatientResponse, VitalSigns, PatientStats, VitalSignsHistoryPoint } from '../types';
import path from 'path';
import fs from 'fs/promises';

export class PatientService {
  private patientRepository: PatientRepository;

  constructor() {
    this.patientRepository = new PatientRepository();
  }

  async createPatient(data: {
    name: string;
    age: number;
    condition: string;
    photo?: Express.Multer.File;
  }): Promise<PatientResponse> {
    let photoUrl: string | undefined;

    // Handle photo upload
    if (data.photo) {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      
      const fileName = `${Date.now()}-${data.photo.originalname}`;
      const filePath = path.join(uploadsDir, fileName);
      
      await fs.writeFile(filePath, data.photo.buffer);
      photoUrl = `/uploads/${fileName}`;
    }

    const patient = await this.patientRepository.create({
      name: data.name,
      age: data.age,
      condition: data.condition,
      photoUrl,
    });

    return this.formatPatientResponse(patient);
  }

  async getAllPatients(): Promise<PatientResponse[]> {
    const patients = await this.patientRepository.findAll();
    return patients.map(patient => this.formatPatientResponse(patient));
  }

  async getPatientById(id: string): Promise<PatientResponse | null> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) return null;
    
    return this.formatPatientResponse(patient);
  }

  async updatePatient(id: string, data: Partial<{
    name: string;
    age: number;
    condition: string;
  }>): Promise<PatientResponse> {
    const patient = await this.patientRepository.update(id, data);
    return this.formatPatientResponse(patient);
  }

  async deletePatient(id: string): Promise<void> {
    await this.patientRepository.delete(id);
  }

  async addVitalSigns(patientId: string, vitalSigns: {
    heartRate: number;
    oxygenSat: number;
    systolic: number;
    diastolic: number;
    temperature: number;
  }): Promise<void> {
    await this.patientRepository.addVitalSigns(patientId, vitalSigns);
  }

  async getPatientHistory(patientId: string): Promise<{
    patientId: string;
    data: VitalSignsHistoryPoint[];
  }> {
    const history = await this.patientRepository.getVitalSignsHistory(patientId, 100);
    
    return {
      patientId,
      data: history.map(record => ({
        timestamp: record.timestamp.toISOString(),
        vitalSigns: {
          heartRate: record.heartRate,
          oxygenSaturation: record.oxygenSat,
          bloodPressure: {
            systolic: record.systolic,
            diastolic: record.diastolic,
          },
          temperature: record.temperature,
        }
      }))
    };
  }

  async getPatientStats(patientId: string): Promise<PatientStats> {
    const stats = await this.patientRepository.getVitalSignsStats(patientId);
    
    const calculateAverages = (records: any[]): VitalSigns => {
      if (records.length === 0) {
        return {
          heartRate: 0,
          oxygenSaturation: 0,
          bloodPressure: { systolic: 0, diastolic: 0 },
          temperature: 0
        };
      }

      const sum = records.reduce((acc, record) => ({
        heartRate: acc.heartRate + record.heartRate,
        oxygenSat: acc.oxygenSat + record.oxygenSat,
        systolic: acc.systolic + record.systolic,
        diastolic: acc.diastolic + record.diastolic,
        temperature: acc.temperature + record.temperature,
      }), {
        heartRate: 0,
        oxygenSat: 0,
        systolic: 0,
        diastolic: 0,
        temperature: 0,
      });

      const count = records.length;
      return {
        heartRate: Math.round(sum.heartRate / count),
        oxygenSaturation: Math.round(sum.oxygenSat / count),
        bloodPressure: {
          systolic: Math.round(sum.systolic / count),
          diastolic: Math.round(sum.diastolic / count),
        },
        temperature: parseFloat((sum.temperature / count).toFixed(1)),
      };
    };

    return {
      averages: {
        last24h: calculateAverages(stats.last24h),
        last7days: calculateAverages(stats.last7days),
        lastMonth: calculateAverages(stats.lastMonth),
      }
    };
  }

  private formatPatientResponse(patient: any): PatientResponse {
    // Generate mock vital signs if no current data exists
    const currentVitalSigns: VitalSigns = {
      heartRate: patient.currentHeartRate || this.generateMockHeartRate(),
      oxygenSaturation: patient.currentOxygenSat || this.generateMockOxygenSat(),
      bloodPressure: {
        systolic: patient.currentSystolic || this.generateMockSystolic(),
        diastolic: patient.currentDiastolic || this.generateMockDiastolic(),
      },
      temperature: patient.currentTemperature || this.generateMockTemperature(),
    };

    return {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      condition: patient.condition,
      photoUrl: patient.photoUrl,
      transmissionsCount: patient.transmissionsCount,
      lastTransmission: patient.lastTransmission.toISOString(),
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
      currentVitalSigns,
    };
  }

  // Mock data generators for demo purposes
  private generateMockHeartRate(): number {
    return Math.floor(Math.random() * (100 - 60 + 1)) + 60; // 60-100 BPM
  }

  private generateMockOxygenSat(): number {
    return Math.floor(Math.random() * (100 - 95 + 1)) + 95; // 95-100%
  }

  private generateMockSystolic(): number {
    return Math.floor(Math.random() * (140 - 110 + 1)) + 110; // 110-140 mmHg
  }

  private generateMockDiastolic(): number {
    return Math.floor(Math.random() * (90 - 70 + 1)) + 70; // 70-90 mmHg
  }

  private generateMockTemperature(): number {
    return parseFloat((Math.random() * (37.5 - 36.0) + 36.0).toFixed(1)); // 36.0-37.5°C
  }
}
