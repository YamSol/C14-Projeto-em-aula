import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const authRouter = Router();
const authController = new AuthController();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
authRouter.post('/login', authController.login);

export default authRouter;
