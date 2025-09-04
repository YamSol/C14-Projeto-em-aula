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
      const { transmitter_id, heart_rate, oxygen_level, temperature } = req.body;

      if (!transmitter_id || !heart_rate || !oxygen_level || !temperature) {
        res.status(400).json({
          success: false,
          message: 'Dados incompletos. Os campos transmitter_id, heart_rate, oxygen_level e temperature são obrigatórios.',
          data: null
        } as ApiResponse);
        return;
      }

      const result = await this.patientService.addVitalSignsFromGateway({
        transmitterId: transmitter_id,
        heartRate: heart_rate,
        oxygenSat: oxygen_level,
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
