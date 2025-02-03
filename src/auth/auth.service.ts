import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<User> {
    const hashedPassword: string = (await bcrypt.hash(password, 10)) as string;

    const user: User = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async login(authDto: AuthDto): Promise<{ access_token: string }> {
    const { email, password, expiresIn } = authDto;

    // console.log('Login request for email:', email);

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
    // console.log('User from DB:', user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const expirationMap = { '10d': '10d', '6m': '180d', '1y': '365d' };
    const token = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: expirationMap[expiresIn] },
    );

    return { access_token: token };
  }
}
