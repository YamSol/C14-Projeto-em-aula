import { AuthService } from '../services/auth.service';
import bcrypt from 'bcrypt';

describe('AuthService.login', () => {
    let authService: AuthService;

    beforeEach(() => {
        // Criar uma nova instância do service para cada teste
        authService = new AuthService();
    });

    describe('Validação de entrada', () => {
        it('deve validar quando email está vazio', () => {
            const error = authService.validateLoginInput('', 'qualquer_senha');
            expect(error).toBe('Email e senha são obrigatórios');
        });

        it('deve validar quando senha está vazia', () => {
            const error = authService.validateLoginInput('email@teste.com', '');
            expect(error).toBe('Email e senha são obrigatórios');
        });

        it('deve validar quando email é inválido', () => {
            const error = authService.validateLoginInput('emailinvalido', 'senha123');
            expect(error).toBe('Formato de email inválido');
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
        it('deve aceitar emails em diferentes casos', () => {
            const emailMaiusculo = 'EMAIL@TESTE.COM';
            const emailMinusculo = 'email@teste.com';
            
            const errorMaiusculo = authService.validateLoginInput(emailMaiusculo, 'senha123');
            const errorMinusculo = authService.validateLoginInput(emailMinusculo, 'senha123');
            
            // Ambos devem ser válidos
            expect(errorMaiusculo).toBeNull();
            expect(errorMinusculo).toBeNull();
        });

        it('deve aceitar emails com subdomínios', () => {
            const error = authService.validateLoginInput('user@sub.domain.com', 'senha123');
            expect(error).toBeNull();
        });
    });

    describe('Limites e restrições', () => {
        it('deve aceitar senha com tamanho mínimo', () => {
            const senha = '123456'; // mínimo de 6 caracteres
            const error = authService.validateLoginInput('email@teste.com', senha);
            expect(error).toBeNull();
        });

        it('deve aceitar senha com tamanho máximo', () => {
            const senha = 'a'.repeat(72); // limite máximo do bcrypt
            const error = authService.validateLoginInput('email@teste.com', senha);
            expect(error).toBeNull();
        });

        it('deve rejeitar senhas muito longas', () => {
            const senha = 'a'.repeat(73); // além do limite do bcrypt
            const error = authService.validateLoginInput('email@teste.com', senha);
            expect(error).toBe('Senha não pode ter mais que 72 caracteres');
        });
    });

    describe('Tratamento de caracteres especiais', () => {
        it('deve aceitar caracteres especiais no email', () => {
            const error = authService.validateLoginInput('user+test@domain.com', 'senha123');
            expect(error).toBeNull();
        });

        it('deve aceitar caracteres especiais na senha', () => {
            const error = authService.validateLoginInput('email@teste.com', 'senha!@#$%¨&*()');
            expect(error).toBeNull();
        });

        it('deve rejeitar emails muito longos', () => {
            const emailLongo = 'a'.repeat(255) + '@teste.com';
            const error = authService.validateLoginInput(emailLongo, 'senha123');
            expect(error).toBe('Email não pode ter mais que 255 caracteres');
        });
    });
});
