import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) { }

    @Post('signup')
    async signup(@Body() dto: SignupDto) {
        return this.usersService.create(dto.username, dto.password);
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const user = await this.authService.validateUser(dto.username, dto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }
}
