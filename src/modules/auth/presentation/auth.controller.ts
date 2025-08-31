import { Controller, Post, UseGuards, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../application/local-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { ResponseModel } from '../../../shared/models/response.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body(new ValidationPipe({ whitelist: true })) loginUserDto: LoginUserDto) {
    const result = await this.authService.login(loginUserDto);
    return new ResponseModel(HttpStatus.OK, 'Login successful', result);
  }

  @Post('register')
  async register(@Body(new ValidationPipe({ whitelist: true })) registerUserDto: RegisterUserDto) {
    const result = await this.authService.register(registerUserDto);
    return new ResponseModel(HttpStatus.CREATED, 'User registered successfully', result);
  }
}
