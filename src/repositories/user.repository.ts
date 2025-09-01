import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interface que define o User com os campos corretos
interface UserWithRole {
  id: number;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserRepository {
  async findByEmail(email: string): Promise<UserWithRole | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    }) as Promise<UserWithRole | null>;
  }

  async findById(id: number): Promise<UserWithRole | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
    }) as Promise<UserWithRole | null>;
  }

  async create(userData: {
    email: string;
    name: string;
    password: string;
    role?: string;
  }): Promise<UserWithRole> {
    return prisma.user.create({
      data: userData,
    }) as Promise<UserWithRole>;
  }
}
