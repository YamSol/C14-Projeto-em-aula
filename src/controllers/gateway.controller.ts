import { Request, Response } from 'express';
import { PatientService } from '../services/patient.service';
import type { ApiResponse } from '../types';

export class GatewayController {
  private patientService: PatientService;

  constructor() {
    this.patientService = new PatientService();
    this.submitVitalSigns = this.submitVitalSigns.bind(this);
  }

  async submitVitalSigns(req: Request, res: Response): Promise<void> {
    try {
      const { device_id, heart_rate, oxygen_level, systolic, diastolic, temperature } = req.body;

      if (!device_id || !heart_rate || !oxygen_level || !systolic || !diastolic || !temperature) {
        res.status(400).json({
          success: false,
          message: 'Dados incompletos. Todos os campos são obrigatórios.',
          data: null
        } as ApiResponse);
        return;
      }

      const result = await this.patientService.addVitalSignsFromGateway({
        deviceId: device_id,
        heartRate: heart_rate,
        oxygenSat: oxygen_level,
        systolic: systolic,
        diastolic: diastolic,
        temperature: temperature
      });

      if (!result.success) {
        res.status(404).json({
          success: false,
          message: result.message,
          data: null
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Sinais vitais recebidos com sucesso.',
        data: null
      } as ApiResponse);

    } catch (error) {
      console.error('Gateway submit error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }
}
