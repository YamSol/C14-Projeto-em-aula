import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { AuthUser, LoginResponse } from '../types';

export class AuthService {
  private userRepository: UserRepository;
  private saltRounds = 12; // More secure salt rounds

  constructor() {
    this.userRepository = new UserRepository();
  }


  async login(email: string, pass: string): Promise<LoginResponse | null> {
  const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }


    const passwordMatch = await bcrypt.compare(pass, user.password);

    console.log('Password', pass); // Debugging line
    if (!passwordMatch) {
      return null;
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Convert User to AuthUser
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    return {
      user: authUser,
      token
    };
  }

  async hashPassword(password: string): Promise<string> {
    // Force bcrypt to use $2b$ format
    return bcrypt.hash(password, this.saltRounds);
  }

  async createUser(userData: {
    email: string;
    name: string;
    password: string;
    role?: string;
  }): Promise<AuthUser> {
    // Hash the password with $2b$ format
    const hashedPassword = await this.hashPassword(userData.password);
    
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
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
        name: user.name,
        role: user.role
      };
    } catch (error) {
      return null;
    }
  }
}
