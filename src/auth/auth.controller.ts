import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
// import { Throttle } from '@nestjs/throttler';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user
   *
   * @endpoint POST /auth/register
   *
   * @payload
   * {
   *   "email": "user@example.com",  // Required, string, must be unique
   *   "password": "yourSecurePassword123" // Required, string, should be strong
   * }
   *
   * @returns
   * {
   *   "id": "uuid-1234-5678-91011",  // User ID
   *   "email": "user@example.com"
   * }
   */
  @Post('register')
  register(@Body() body: { email: string; password: string }) {
    return this.authService.register(body.email, body.password);
  }

  /**
   * Login user and get JWT token
   *
   * @endpoint POST /auth/login
   *
   * @payload
   * {
   *   "email": "user@example.com",  // Required, string
   *   "password": "yourSecurePassword123", // Required, string
   *   "expiresIn": "10d" // Required, one of ["10d", "6m", "1y"]
   * }
   *
   * @returns
   * {
   *   "access_token": "jwt_token_here"
   * }
   *
   * The `access_token` can be used in subsequent requests by adding:p
   * Authorization: Bearer jwt_token_here
   */
  @Post('login')
  // @Throttle({ limit: 1, ttl: 60 })
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }
}
