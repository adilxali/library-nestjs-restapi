import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { addDays } from 'date-fns';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Injectable()
export class BorrowService {
  constructor(private prisma: PrismaService) {}

  async borrowBook(userId: number, bookId: number, days = 14) {
    const dueAt = addDays(new Date(), days);
    return await this.prisma.$transaction(async (prisma) => {
      const book = await prisma.book.findUnique({
        where: { id: bookId },
      });

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('Invalid User found');
      }

      if (!book) {
        throw new NotFoundException('Book not found');
      }

      if (book.available < 1) {
        throw new BadRequestException('No available copies to borrow');
      }

      await prisma.book.update({
        where: { id: bookId },
        data: {
          available: { decrement: 1 },
        },
      });

      const borrowRecord = await prisma.borrow.create({
        data: {
          userId,
          bookId,
          dueAt,
        },
      });

      return borrowRecord;
    });
  }

  async returnBook(borrowId: number) {
    return await this.prisma.$transaction(async (prisma) => {
      const borrowRecord = await prisma.borrow.findUnique({
        where: { id: borrowId },
        include: { book: true },
      });

      if (!borrowRecord) {
        throw new NotFoundException('Borrow record not found');
      }

      if (borrowRecord.status === 'RETURNED') {
        throw new BadRequestException('Book already returned');
      }

      const now = new Date();
      let lateFeeCents = 0;

      if (now > borrowRecord.dueAt) {
        const lateDays = Math.ceil(
          (now.getTime() - borrowRecord.dueAt.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        lateFeeCents = lateDays * 10;
      }

      await prisma.book.update({
        where: { id: borrowRecord.bookId },
        data: {
          available: { increment: 1 },
        },
      });

      const updatedBorrowRecord = await prisma.borrow.update({
        where: { id: borrowId },
        data: {
          returnedAt: now,
          lateFeeCents,
          status: 'RETURNED',
        },
      });

      return updatedBorrowRecord;
    });
  }

  async getUserBorrows(userId: number) {
    return await this.prisma.borrow.findMany({
      where: { userId },
      include: { book: true },
    });
  }

  async getAllBorrows() {
    return await this.prisma.borrow.findMany({
      include: { book: true, user: true },
    });
  }

  async getBorrowBookHistroy(bookId: number) {
    return await this.prisma.borrow.findMany({
      where: { bookId },
      include: { user: true },
    });
  }
}
