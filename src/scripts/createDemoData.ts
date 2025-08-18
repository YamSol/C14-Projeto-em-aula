import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createDemoData() {
  console.log('🌱 Criando dados de demonstração...');

  // Criar usuário médico se não existir
  const existingUser = await prisma.user.findUnique({
    where: { email: 'medico@vitalsync.com' }
  });

  let user;
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('senha123', 10);
    user = await prisma.user.create({
      data: {
        email: 'medico@vitalsync.com',
        name: 'Dr. João Silva',
        password: hashedPassword
      }
    });
    console.log('✅ Usuário médico criado:', user.email);
  } else {
    user = existingUser;
    console.log('✅ Usuário médico já existe:', user.email);
  }

  console.log('🎉 Dados de demonstração criados com sucesso!');
  console.log('📧 Credenciais de login:');
  console.log('   Email: medico@vitalsync.com');
  console.log('   Senha: senha123');
  console.log('');
  console.log('⚠️  Nota: Os pacientes de demonstração serão criados automaticamente');
  console.log('    através da funcionalidade de dados mock do frontend.');
}

createDemoData()
  .catch((e) => {
    console.error('❌ Erro ao criar dados de demonstração:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
