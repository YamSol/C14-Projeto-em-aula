import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async create(userData: {
    email: string;
    name: string;
    password: string;
    role?: string;
  }): Promise<User> {
    return prisma.user.create({
      data: userData,
    });
  }
}
