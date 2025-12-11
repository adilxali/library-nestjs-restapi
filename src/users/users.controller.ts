import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ParseIntPipe } from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('students')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  async getAllStudents() {
    return this.usersService.getAllStudents();
  }

  @Get(':id')
  async getStudentById(@Param('id') id: string) {
    return this.usersService.getUserById(Number(id));
  }
  @Post('')
  async createStudent(
    @Body() body: { email: string; name: string; password: string },
  ) {
    const errors = [] as string[];
    for (const field of ['email', 'name', 'password']) {
      if (!body[field]) {
        errors.push(`${field} is required`);
      }
    }
    if (errors.length) {
      throw new HttpException(
        {
          success: false,
          message: errors,
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.usersService.newStudent(body.email, body.name, body.password);
  }

  @Put(':id')
  async updateStudent(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; password?: string },
  ) {
    return this.usersService.updateStudent(Number(id), body);
  }

  @Delete(':id')
  async deleteStudent(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteStudent(id);
  }
}
