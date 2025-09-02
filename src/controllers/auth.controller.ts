import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import type { ApiResponse, LoginRequest, LoginResponse } from '../types';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email e senha são obrigatórios',
          data: null
        } as ApiResponse);
        return;
      }

      const result = await this.authService.login(email, password);

      if (!result) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas',
          data: null
        } as ApiResponse);
        return;
      }

      // Set cookie com o token JWT
      const isProduction = process.env.NODE_ENV === 'production';
      
      res.cookie('vitalsync_token', result.token, {
        httpOnly: true,
        secure: isProduction, // true apenas em produção (HTTPS)
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        path: '/',
      });

      // Retorna apenas os dados do usuário, não o token
      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: { user: result.user }
      } as ApiResponse<Omit<LoginResponse, 'token'>>);
    } 
    catch (error) {
      if (error instanceof TypeError) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas',
          data: null
        } as ApiResponse);
      }
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Remove o cookie do token JWT
      const isProduction = process.env.NODE_ENV === 'production';
      
      res.clearCookie('vitalsync_token', {
        httpOnly: true,
        secure: isProduction, // true apenas em produção (HTTPS)
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
      });
      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso',
        data: null
      } as ApiResponse);
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = req.user;
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Usuário não autenticado',
          data: null
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Perfil do usuário',
        data: user
      } as ApiResponse);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        data: null
      } as ApiResponse);
    }
  }
}
