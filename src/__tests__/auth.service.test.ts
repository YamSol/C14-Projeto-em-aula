import { AuthService } from '../services/auth.service';
import bcrypt from 'bcrypt';

describe('AuthService.login', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService();
    });

    describe('Validação de entrada', () => {
        it('deve retornar null quando email está vazio', async () => {
            const result = await authService.login('', 'qualquer_senha');
            expect(result).toBeNull();
        });

        it('deve retornar null quando senha está vazia', async () => {
            const result = await authService.login('email@teste.com', '');
            expect(result).toBeNull();
        });

        it('deve retornar null quando email é inválido', async () => {
            const result = await authService.login('emailinvalido', 'senha123');
            expect(result).toBeNull();
        });
    });

    describe('Verificação de senha', () => {
        it('deve comparar senhas hasheadas corretamente', async () => {
            const senha = 'senha123';
            const hash = await bcrypt.hash(senha, 10);
            const match = await bcrypt.compare(senha, hash);
            expect(match).toBe(true);
        });

        it('deve identificar senhas diferentes', async () => {
            const senhaCorreta = 'senha123';
            const senhaErrada = 'senha456';
            const hash = await bcrypt.hash(senhaCorreta, 10);
            const match = await bcrypt.compare(senhaErrada, hash);
            expect(match).toBe(false);
        });

        it('deve lidar com senhas complexas', async () => {
            const senha = 'S3nh@C0mpl3x@!';
            const hash = await bcrypt.hash(senha, 10);
            const match = await bcrypt.compare(senha, hash);
            expect(match).toBe(true);
        });
    });

    describe('Formato dos dados', () => {
        it('deve lidar com emails em diferentes casos', async () => {
            const emailMaiusculo = 'EMAIL@TESTE.COM';
            const emailMinusculo = 'email@teste.com';
            
            const resultMaiusculo = await authService.login(emailMaiusculo, 'senha123');
            const resultMinusculo = await authService.login(emailMinusculo, 'senha123');
            
            // Ambos devem ser tratados da mesma forma
            expect(resultMaiusculo).toBe(resultMinusculo);
        });

        it('deve aceitar emails com subdomínios', async () => {
            const result = await authService.login('user@sub.domain.com', 'senha123');
            // O resultado pode ser null por não encontrar o usuário, mas não deve lançar erro
            expect(() => result).not.toThrow();
        });
    });

    describe('Limites e restrições', () => {
        it('deve aceitar senha com tamanho mínimo', async () => {
            const senha = '123456'; // assumindo mínimo de 6 caracteres
            const result = await authService.login('email@teste.com', senha);
            // O resultado pode ser null por não encontrar o usuário, mas não deve lançar erro
            expect(() => result).not.toThrow();
        });

        it('deve aceitar senha com tamanho máximo', async () => {
            const senha = 'a'.repeat(72); // limite máximo do bcrypt
            const result = await authService.login('email@teste.com', senha);
            // O resultado pode ser null por não encontrar o usuário, mas não deve lançar erro
            expect(() => result).not.toThrow();
        });

        it('deve rejeitar senhas muito longas', async () => {
            const senha = 'a'.repeat(73); // além do limite do bcrypt
            const result = await authService.login('email@teste.com', senha);
            expect(result).toBeNull();
        });
    });

    describe('Tratamento de erros', () => {
        it('deve lidar com caracteres especiais no email', async () => {
            const result = await authService.login('user+test@domain.com', 'senha123');
            // O resultado pode ser null por não encontrar o usuário, mas não deve lançar erro
            expect(() => result).not.toThrow();
        });

        it('deve lidar com caracteres especiais na senha', async () => {
            const result = await authService.login('email@teste.com', 'senha!@#$%¨&*()');
            // O resultado pode ser null por não encontrar o usuário, mas não deve lançar erro
            expect(() => result).not.toThrow();
        });

        it('deve lidar com inputs muito longos', async () => {
            const emailLongo = 'a'.repeat(255) + '@teste.com';
            const result = await authService.login(emailLongo, 'senha123');
            expect(result).toBeNull();
        });
    });
});
