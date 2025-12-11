import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParseIntPipe } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post('')
  async borrowBook(
    @Body() body: { userId: number; bookId: number; days?: number },
  ) {
    return this.borrowService.borrowBook(body.userId, body.bookId, body.days);
  }

  @Put('return/:borrowId')
  async returnBook(@Param('borrowId', ParseIntPipe) borrowId: number) {
    return this.borrowService.returnBook(borrowId);
  }

  @Get('')
  async getAllBorrows() {
    return this.borrowService.getAllBorrows();
  }

  @Get('history/:bookId')
  async getBorrowBookHistory(@Param('bookId', ParseIntPipe) bookId: number) {
    return this.borrowService.getBorrowBookHistroy(bookId);
  }

  @Get('user/:userId')
  async getUserBorrowHistory(@Param('userId', ParseIntPipe) userId: number) {
    return this.borrowService.getUserBorrows(userId);
  }
}
