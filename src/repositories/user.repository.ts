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
}
