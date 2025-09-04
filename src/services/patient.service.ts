import { PatientRepository } from '../repositories/patient.repository';
import type { Patient, VitalSigns as VitalSignsData } from '@prisma/client';
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
    deviceId?: string;
  }): Promise<PatientResponse> {
    let photoUrl: string | undefined;

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
      deviceId: data.deviceId,
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

  async updatePatient(id: string, data: Partial<Patient>): Promise<PatientResponse> {
    const patient = await this.patientRepository.update(id, data);
    return this.formatPatientResponse(patient);
  }

  async deletePatient(id: string): Promise<void> {
    await this.patientRepository.delete(id);
  }

  async addVitalSigns(patientId: string, vitalSigns: {
    heartRate: number;
    oxygenSat: number;
    temperature: number;
  }): Promise<void> {
    await this.patientRepository.addVitalSigns(patientId, vitalSigns);
  }

  async addVitalSignsFromGateway(gatewayData: {
    transmitterId: string;
    heartRate: number;
    oxygenSat: number;
    temperature: number;
  }): Promise<{ success: boolean; message: string }> {
    const patient = await this.patientRepository.findByDeviceId(gatewayData.transmitterId);

    if (!patient) {
      return { success: false, message: 'Paciente com o transmitter_id fornecido não encontrado.' };
    }

    await this.patientRepository.addVitalSigns(patient.id, {
      heartRate: gatewayData.heartRate,
      oxygenSat: gatewayData.oxygenSat,
      temperature: gatewayData.temperature,
    });

    return { success: true, message: 'Sinais vitais adicionados com sucesso.' };
  }

  async getPatientStats(patientId: string): Promise<PatientStats> {
    const history = await this.patientRepository.getVitalSignsHistory(patientId, 100);

    const last24h = this.calculateAverageVitalSigns(history, 24);
    const last7days = this.calculateAverageVitalSigns(history, 7);
    const lastMonth = this.calculateAverageVitalSigns(history, 30);

    return {
      averages: {
        last24h,
        last7days,
        lastMonth,
      },
    };
  }
  private calculateAverageVitalSigns(history: VitalSignsData[], hours: number): VitalSigns {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const relevantRecords = history.filter(record => record.timestamp >= cutoff);

    if (relevantRecords.length === 0) {
      return {
        heartRate: 0,
        oxygenSaturation: 0,
        temperature: 0,
      };
    }

    const totals = relevantRecords.reduce((acc, record) => {
      acc.heartRate += record.heartRate;
      acc.oxygenSaturation += record.oxygenSat;
      acc.temperature += record.temperature;
      return acc;
    }, {
      heartRate: 0,
      oxygenSaturation: 0,
      temperature: 0,
    });

    const count = relevantRecords.length;

    return {
      heartRate: totals.heartRate / count,
      oxygenSaturation: totals.oxygenSaturation / count,
      temperature: totals.temperature / count,
    };
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
          temperature: record.temperature,
        }
      }))
    };
  }

  private formatPatientResponse(patient: Patient & { vitalSigns?: VitalSignsData[] }): PatientResponse {
    const currentVitalSigns: VitalSigns = {
      heartRate: patient.currentHeartRate ?? 0,
      oxygenSaturation: patient.currentOxygenSat ?? 0,
      temperature: patient.currentTemperature ?? 0,
    };

    return {
      id: patient.id,
      name: patient.name,
      age: patient.age,
      condition: patient.condition,
      photoUrl: patient.photoUrl ?? undefined,
      transmissionsCount: patient.transmissionsCount,
      lastTransmission: patient.lastTransmission.toISOString(),
      createdAt: patient.createdAt.toISOString(),
      updatedAt: patient.updatedAt.toISOString(),
      currentVitalSigns,
    };
  }
}