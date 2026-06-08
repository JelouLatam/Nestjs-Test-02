import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { RegisterUserDto } from '../presentation/dto/register-user.dto';
import { LoginUserDto } from '../presentation/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async validateUser(
    user: LoginUserDto,
  ): Promise<Omit<User, 'password'> | null> {
    const foundUser = await this.findOne(user.username);
    if (
      foundUser &&
      (await bcrypt.compare(user.password, foundUser.password))
    ) {
      return {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
      };
    }
    return null;
  }

  async login(user: LoginUserDto) {
    const dbUser = await this.findOne(user.username);
    if (!dbUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordValid = await bcrypt.compare(user.password, dbUser.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: dbUser.username, sub: dbUser.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const { username, email, password, firstName, lastName } = registerUserDto;
    const userExists = await this.findOne(username);
    if (userExists) {
      throw new BadRequestException('Username already exists');
    }
    const emailExists = await this.findByEmail(email);
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    const savedUser = await this.userRepository.save(user);
    return {
      id: savedUser.id,
      username: savedUser.username,
      email: savedUser.email,
    };
  }
}
