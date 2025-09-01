import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Hash the password with $2b$ format
    const hashedPassword = await bcrypt.hash('senha123', 12);
    console.log('Hashed password:', hashedPassword);
    
    // Delete existing user if exists
    await prisma.user.deleteMany({
      where: {
        email: 'medico@vitalsync.com'
      }
    });
    
    // Create new user with properly hashed password
    const user = await prisma.user.create({
      data: {
        email: 'medico@vitalsync.com',
        name: 'Dr. João Silva',
        password: hashedPassword,
        role: 'doctor'
      }
    });
    
    console.log('Test user created successfully:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
