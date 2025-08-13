import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
    this.login = this.login.bind(this);
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ message: 'Email and password are required' });
      return;
    }

    const result = await this.authService.login(email, password);

    if (!result) {
      res.status(401).send({ message: 'Invalid credentials' });
      return;
    }

    res.status(200).send({ token: result });
  }
}
