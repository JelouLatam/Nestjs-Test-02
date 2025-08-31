import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from '../application/local-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ValidationPipe } from '@nestjs/common';
import { ResponseModel } from '../../../shared/models/response.model';

@ApiTags('Auth')
@ApiExtraModels(ResponseModel, LoginUserDto, RegisterUserDto)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    type: LoginUserDto,
    examples: {
      basic: {
        summary: 'Login example',
        value: { username: 'newuser', password: 'pass123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: ResponseModel,
  })
  async login(
    @Body(new ValidationPipe({ whitelist: true })) loginUserDto: LoginUserDto,
  ) {
    const result = await this.authService.login(loginUserDto);
    return new ResponseModel(HttpStatus.OK, 'Login successful', result);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({
    type: RegisterUserDto,
    examples: {
      basic: {
        summary: 'Register example',
        value: {
          username: 'newuser',
          password: 'pass123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@email.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: ResponseModel,
  })
  async register(
    @Body(new ValidationPipe({ whitelist: true }))
    registerUserDto: RegisterUserDto,
  ) {
    const result = await this.authService.register(registerUserDto);
    return new ResponseModel(
      HttpStatus.CREATED,
      'User registered successfully',
      result,
    );
  }
}
