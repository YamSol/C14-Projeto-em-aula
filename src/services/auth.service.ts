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


  /**
   * Valida os dados de entrada do login sem acessar o banco de dados
   */
  validateLoginInput(email: any, pass: any): string | null {
    // Validações básicas
    if (!email || !pass) {
      return "Email e senha são obrigatórios";
    }

    // Validação de tipo
    if (typeof email !== 'string' || typeof pass !== 'string') {
      return "Email e senha devem ser strings";
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid e-mail format";
    }

    // Validação de tamanho
    if (email.length > 255) {
      return "Email não pode ter mais que 255 caracteres";
    }

    if (pass.length > 72) {
      return "Senha não pode ter mais que 72 caracteres";
    }

    // Validação de tamanho mínimo da senha
    if (pass.length < 6) {
      return "Senha deve ter pelo menos 6 caracteres";
    }

    return null; // Nenhum erro encontrado
  }

  async login(email: any, pass: any): Promise<LoginResponse | null> {
    // Primeira etapa: validação sem acesso ao banco
    const validationError = this.validateLoginInput(email, pass);
    if (validationError !== null) {
      return null;
    }

    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        return null;
      }

      const passwordMatch = await bcrypt.compare(pass, user.password);

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
    } catch (error) {
      // Agora que a validação está separada, podemos ser mais específicos sobre erros
      if (error instanceof Error && error.name === 'PrismaClientKnownRequestError') {
        return null; // Erro de banco de dados
      }
      throw error; // Outros erros não esperados devem ser propagados
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async createUser(userData: {
    email: string;
    name: string;
    password: string;
    role?: string;
  }): Promise<AuthUser> {
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
