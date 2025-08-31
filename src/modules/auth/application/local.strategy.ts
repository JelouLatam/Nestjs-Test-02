import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../presentation/dto/login-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(user: LoginUserDto): Promise<any> {
    const foundUser = await this.authService.validateUser(user);
    if (!foundUser) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
