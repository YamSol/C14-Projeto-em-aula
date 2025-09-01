import { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types';

export const authenticateApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.GATEWAY_API_KEY;

  if (!expectedApiKey) {
    console.error('GATEWAY_API_KEY não está configurada no servidor.');
    res.status(500).json({
      success: false,
      message: 'Erro de configuração do servidor',
      data: null
    } as ApiResponse);
    return;
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    res.status(401).json({
      success: false,
      message: 'Chave de API inválida ou não fornecida',
      data: null
    } as ApiResponse);
    return;
  }

  next();
};