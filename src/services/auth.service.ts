import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { AuthUser, LoginResponse } from '../types';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(email: string, password: string): Promise<LoginResponse | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return null;
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name || 'Usuario',
      role: user.role || 'doctor'
    };

    return {
      user: authUser,
      token
    };
  }

  private generateToken(userId: number): string {
    const secret = process.env.JWT_SECRET || 'vitalsync_secret_key';
    return jwt.sign(
      { userId },
      secret,
      { expiresIn: '7d' }
    );
  }

  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const secret = process.env.JWT_SECRET || 'vitalsync_secret_key';
      const decoded = jwt.verify(token, secret) as { userId: number };
      
      const user = await this.userRepository.findById(decoded.userId);
      
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name || 'Usuario',
        role: user.role || 'doctor'
      };
    } catch (error) {
      return null;
    }
  }
}
