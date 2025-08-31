import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/modules/auth/presentation/auth.controller';
import { AuthService } from '../src/modules/auth/application/auth.service';
import { LoginUserDto } from '../src/modules/auth/presentation/dto/login-user.dto';
import { RegisterUserDto } from '../src/modules/auth/presentation/dto/register-user.dto';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: typeof mockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return access_token for valid credentials', async () => {
      const dto: LoginUserDto = { username: 'testuser', password: 'password' };
      authService.login.mockResolvedValue({ access_token: 'mocked-jwt-token' });
      const result = await controller.login(dto);
      expect(result.data).toEqual({ access_token: 'mocked-jwt-token' });
      expect(authService.login).toHaveBeenCalledWith(dto);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const dto: LoginUserDto = { username: 'testuser', password: 'wrong' };
      authService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );
      await expect(controller.login(dto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('register', () => {
    it('should return user data for valid registration', async () => {
      const dto: RegisterUserDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password',
        firstName: 'New',
        lastName: 'User',
      };
      authService.register.mockResolvedValue({
        id: 2,
        username: 'newuser',
        email: 'new@example.com',
      });
      const result = await controller.register(dto);
      expect(result.data).toEqual({
        id: 2,
        username: 'newuser',
        email: 'new@example.com',
      });
      expect(authService.register).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException if registration fails', async () => {
      const dto: RegisterUserDto = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password',
        firstName: 'Existing',
        lastName: 'User',
      };
      authService.register.mockRejectedValue(
        new BadRequestException('Username already exists'),
      );
      await expect(controller.register(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
