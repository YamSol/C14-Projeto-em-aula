import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';

describe('AuthController.login', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(() => {
        // Mock do UserRepository
        const mockUserRepository = {
            findByEmail: jest.fn().mockResolvedValue(null)
        };

        // Mock do AuthService
        authService = new AuthService();
        jest.spyOn(authService, 'login').mockImplementation(async (email, password) => {
            if (!email || !password) {
                return null;
            }
            if (typeof email !== 'string') {
                return null;
            }
            if (!email.includes('@')) {
                return null;
            }
            if (email.length > 255) {
                return null;
            }
            // Simulando que não encontrou o usuário
            return null;
        });

        // Criando o controller com o serviço mockado
        authController = new AuthController();
        // @ts-ignore - ignorando erro de tipo para poder substituir a instância
        authController.authService = authService;
    });

    // Função auxiliar para criar uma resposta simulada
    function createResponse(): Partial<Response> {
        const res: Partial<Response> = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.cookie = jest.fn().mockReturnValue(res);
        res.clearCookie = jest.fn().mockReturnValue(res);
        return res;
    }

    describe('Validação do corpo da requisição', () => {
        it('deve rejeitar requisição sem corpo', async () => {
            const req = { body: {} } as Request;
            const res = createResponse();

            await authController.login(req, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Email e senha são obrigatórios',
                data: null
            });
        });

        it('deve rejeitar requisição sem email', async () => {
            const req = {
                body: {
                    password: 'senha123'
                }
            } as Request;
            const res = createResponse();

            await authController.login(req, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Email e senha são obrigatórios',
                data: null
            });
        });

        it('deve rejeitar requisição sem senha', async () => {
            const req = {
                body: {
                    email: 'teste@email.com'
                }
            } as Request;
            const res = createResponse();

            await authController.login(req, res as Response);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Email e senha são obrigatórios',
                data: null
            });
        });
    });

    describe('Formato da requisição', () => {
        it('deve aceitar requisição com email e senha', async () => {
            const req = {
                body: {
                    email: 'teste@email.com',
                    password: 'senha123'
                }
            } as Request;
            const res = createResponse();

            await authController.login(req, res as Response);

            // Como não temos um usuário real no banco, esperamos 401
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Credenciais inválidas',
                data: null
            });
        });

        it('deve lidar com campos extras no body', async () => {
            const req = {
                body: {
                    email: 'teste@email.com',
                    password: 'senha123',
                    extraField: 'valor extra'
                }
            } as Request;
            const res = createResponse();

            await authController.login(req, res as Response);

            // O controller deve ignorar campos extras
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Credenciais inválidas',
                data: null
            });
        });
    });

    describe('Tratamento de tipos de dados', () => {
        it('deve rejeitar email como número', async () => {
            const req = {
                body: {
                    email: 123,
                    password: 'senha123'
                }
            } as unknown as Request;
            const res = createResponse();

            await authController.login(req, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Credenciais inválidas',
                data: null
            });
        });

        it('deve rejeitar senha como número', async () => {
            const req = {
                body: {
                    email: 'teste@email.com',
                    password: 123
                }
            } as unknown as Request;
            const res = createResponse();

            await authController.login(req, res as Response);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Credenciais inválidas',
                data: null
            });
        });
    });

    describe('Formato da resposta', () => {
        it('deve retornar objeto com mensagem de erro', async () => {
            const req = {
                body: {}
            } as Request;
            const res = createResponse();

            await authController.login(req, res as Response);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: expect.any(String),
                    data: null
                })
            );
        });

        it('deve manter consistência no formato de erro', async () => {
            const req1 = { body: {} } as Request;
            const req2 = { body: { email: 'teste@email.com' } } as Request;
            const res1 = createResponse();
            const res2 = createResponse();

            await authController.login(req1, res1 as Response);
            await authController.login(req2, res2 as Response);

            // Ambas as respostas devem ter o mesmo formato
            expect(res1.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: expect.any(String),
                    data: null
                })
            );
            expect(res2.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: expect.any(String),
                    data: null
                })
            );
        });
    });
});
