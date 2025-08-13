import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(email: string, pass: string): Promise<string | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatch = await bcrypt.compare(pass, user.password);

    if (!passwordMatch) {
      return null;
    }

    // TODO: Generate JWT token
    return 'login successful';
  }
}
