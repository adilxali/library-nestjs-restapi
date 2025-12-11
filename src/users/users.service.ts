import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async getAllStudents() {
    return this.prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
    });
  }

  async getUserById(userId: number) {
    const isUserExist = await this.checkUserExists(userId);
    if (!isUserExist) {
      throw new HttpException(
        { success: false, message: 'Student not found', code: 404 },
        404,
      );
    }
    return this.prisma.user.findUnique({
      where: {
        id: userId,
        role: 'STUDENT',
      },
    });
  }

  async newStudent(email: string, name: string, password: string) {
    return this.prisma.user.create({
      data: {
        email,
        name,
        password,
        role: 'STUDENT',
      },
    });
  }

  async deleteStudent(userId: number) {
    return this.prisma.user.delete({
      where: {
        id: userId,
        role: 'STUDENT',
      },
    });
  }

  async updateStudent(
    userId: number,
    data: { name?: string; password?: string },
  ) {
    return this.prisma.user.update({
      where: {
        id: userId,
        role: 'STUDENT',
      },
      data,
    });
  }

  async booksBorrowedByUser(userId: number) {
    return this.prisma.borrow.findMany({
      where: {
        userId,
      },
      include: {
        book: true,
      },
    });
  }

  private async checkUserExists(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
