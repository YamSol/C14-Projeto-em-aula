import { Response } from 'express';
import { PatientService } from '../services/patient.service';
import type { ApiResponse } from '../types';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export class PatientController {
  private patientService: PatientService;

  constructor() {
    this.patientService = new PatientService();
    this.createPatient = this.createPatient.bind(this);
    this.getAllPatients = this.getAllPatients.bind(this);
    this.getPatientById = this.getPatientById.bind(this);
    this.updatePatient = this.updatePatient.bind(this);
    this.deletePatient = this.deletePatient.bind(this);
    this.getPatientHistory = this.getPatientHistory.bind(this);
    this.getPatientStats = this.getPatientStats.bind(this);
    this.addVitalSigns = this.addVitalSigns.bind(this);
    this.getUserByTransmitterId = this.getUserByTransmitterId.bind(this);
  }

  async createPatient(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name, age, condition, transmitterId } = req.body;
      const photo = req.file;

      if (!name || !age || !condition || !transmitterId) {
        res.status(400).json({
          success: false,
          message: 'Nome, idade, condição e ID do transmissor são obrigatórios',
          data: null
        } as ApiResponse);
        return;
      }

      const patient = await this.patientService.createPatient({
        name,
        age: parseInt(age),
        condition,
        photo,
        transmitterId
      });

      res.status(201).json({
        success: true,
        message: 'Paciente criado com sucesso',
        data: patient
      } as ApiResponse);
    } catch (error) {
      console.error('Create patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }

  async getAllPatients(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const patients = await this.patientService.getAllPatients();
      
      res.status(200).json({
        success: true,
        message: 'Lista de pacientes',
        data: patients
      } as ApiResponse);
    } catch (error) {
      console.error('Get patients error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }

  async getPatientById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const patient = await this.patientService.getPatientById(id);
      
      if (!patient) {
        res.status(404).json({
          success: false,
          message: 'Paciente não encontrado',
          data: null
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Dados do paciente',
        data: patient
      } as ApiResponse);
    } catch (error) {
      console.error('Get patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }

  async updatePatient(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const patient = await this.patientService.updatePatient(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Paciente atualizado com sucesso',
        data: patient
      } as ApiResponse);
    } catch (error) {
      console.error('Update patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }

  async deletePatient(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      await this.patientService.deletePatient(id);
      
      res.status(200).json({
        success: true,
        message: 'Paciente removido com sucesso',
        data: null
      } as ApiResponse);
    } catch (error) {
      console.error('Delete patient error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }

  async getPatientHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const history = await this.patientService.getPatientHistory(id);
      
      res.status(200).json({
        success: true,
        message: 'Histórico do paciente',
        data: history
      } as ApiResponse);
    } catch (error) {
      console.error('Get patient history error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }

  async getPatientStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const stats = await this.patientService.getPatientStats(id);
      
      res.status(200).json({
        success: true,
        message: 'Estatísticas do paciente',
        data: stats
      } as ApiResponse);
    } catch (error) {
      console.error('Get patient stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }

  async addVitalSigns(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { transmitterId, heartRate, oxygenSaturation, temperature } = req.body;

      if (!heartRate || !oxygenSaturation || !temperature) {
        res.status(400).json({
          success: false,
          message: 'Todos os sinais vitais são obrigatórios',
          data: null
        } as ApiResponse);
        return;
      }

      await this.patientService.addVitalSigns(id, {
        heartRate,
        oxygenSaturation,
        temperature
      });
      
      res.status(200).json({
        success: true,
        message: 'Sinais vitais adicionados com sucesso',
        data: null
      } as ApiResponse);
    } catch (error) {
      console.error('Add vital signs error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }

  async getUserByTransmitterId(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { transmitterId } = req.params;

      if (!transmitterId) {
        res.status(400).json({
          success: false,
          message: 'Transmitter ID é obrigatório',
          data: null
        } as ApiResponse);
        return;
      }

      const result = await this.patientService.getUserByTransmitterId(transmitterId);
      
      if (!result) {
        res.status(404).json({
          success: false,
          message: 'Paciente não encontrado para o transmitter ID fornecido',
          data: null
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Paciente encontrado',
        data: result
      } as ApiResponse);
    } catch (error) {
      console.error('Get user by transmitter ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }
}
