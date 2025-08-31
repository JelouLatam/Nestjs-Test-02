import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from '../src/modules/auth/application/local.strategy';
import { AuthService } from '../src/modules/auth/application/auth.service';
import { UnauthorizedException } from '@nestjs/common';

const mockAuthService = {
  validateUser: jest.fn(),
};

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: typeof mockAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should return user data if credentials are valid', async () => {
      const user = { id: 1, username: 'testuser', email: 'test@example.com' };
      authService.validateUser.mockResolvedValue(user);
      const result = await strategy.validate('testuser', 'password');
      expect(result).toEqual(user);
      expect(authService.validateUser).toHaveBeenCalledWith({ username: 'testuser', password: 'password' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      authService.validateUser.mockResolvedValue(null);
      await expect(strategy.validate('testuser', 'wrong')).rejects.toThrow(UnauthorizedException);
    });
  });
});
