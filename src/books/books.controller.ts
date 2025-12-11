import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NewBookDto } from './dto/new-book.dto';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}
  @Post()
  async createBook(@Body() bookData: NewBookDto) {
    return this.booksService.createNewBook(bookData);
  }

  @Get()
  async getAllBooks() {
    return this.booksService.getAllBooks();
  }
  @Get(':id')
  async getBookById(@Param('id') bookId: number) {
    return this.booksService.getBookById(Number(bookId));
  }

  @Put(':id')
  async updateBook(
    @Param('id') bookId: number,
    @Body() updateData: Partial<NewBookDto>,
  ) {
    return this.booksService.updateBook(Number(bookId), updateData);
  }

  @Delete(':id')
  async deleteBook(@Param('id') bookId: number) {
    return this.booksService.deleteBook(Number(bookId));
  }
}
