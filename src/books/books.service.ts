import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Book } from './type';
@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}
  async createNewBook(bookData: Book) {
    const availableCopies = bookData.available ?? bookData.totalCopies;
    bookData.available = availableCopies;
    bookData.isbn = bookData.isbn?.toLocaleLowerCase() ?? null;
    let isBookAlreadyExists = {} as Book | null;
    if (bookData.isbn) {
      isBookAlreadyExists = await this.isAlreadyexists(bookData.isbn);
    }
    if (isBookAlreadyExists?.id) {
      bookData.totalCopies =
        isBookAlreadyExists.totalCopies + bookData.totalCopies;
      bookData.available = isBookAlreadyExists.available! + availableCopies;
      return this.updateBook(Number(isBookAlreadyExists.id), bookData);
    }
    return this.prisma.book.create({
      data: bookData,
    });
  }

  async getAllBooks() {
    return this.prisma.book.findMany();
  }

  async getBookById(bookId: number) {
    return this.prisma.book.findUnique({
      where: { id: Number(bookId) },
    });
  }

  async updateBook(bookId: number, updateData: Partial<Book>) {
    return this.prisma.book.update({
      where: { id: bookId },
      data: updateData,
    });
  }

  async deleteBook(bookId: number) {
    return this.prisma.book.delete({
      where: { id: bookId },
    });
  }

  private async countAvailableCopies(bookId: number): Promise<number> {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
      select: { available: true },
    });
    return book?.available ?? 0;
  }

  private async countTotalCopies(bookId: number): Promise<number> {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
      select: { totalCopies: true },
    });
    return book?.totalCopies ?? 0;
  }

  private async isAlreadyexists(isbn: string) {
    const book = await this.prisma.book.findUnique({
      where: { isbn },
    });
    return book;
  }
}
