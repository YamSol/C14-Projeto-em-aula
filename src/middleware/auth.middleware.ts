import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import type { AuthUser } from '../types';

interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Token de acesso requerido',
      data: null
    });
    return;
  }

  try {
    const authService = new AuthService();
    const user = await authService.verifyToken(token);
    
    if (!user) {
      res.status(403).json({
        success: false,
        message: 'Token inválido ou expirado',
        data: null
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Token inválido',
      data: null
    });
  }
};

export type { AuthenticatedRequest };
