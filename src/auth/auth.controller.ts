import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  async register(@Body() userData: CreateUserDto) {
    console.log('Registering user with data:', userData);
    return this.authService.registerUser(userData);
  }

  @Post('login')
  async login(@Body() authCred: LoginUserDto) {
    return this.authService.loginUser(authCred);
  }
}
