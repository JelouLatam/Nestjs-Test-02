// test/auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AuthDto } from '../dto/auth.dto';
import { User } from '../entities/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const MOCK_USER_ID = '289c9b37-5d32-4411-825b-3fb042f6b749';
  const MOCK_USER_EMAIL = 'test@example.com';
  const MOCK_USER_PASSWORD_HASH =
    '$2b$10$IAs.mvPApivMuo9/mKvDLew2uW.UD.4Ult6Ock7s.mN5RnNwh.GQm';
  const MOCK_USER_PASSWORD_PLAIN = '12x3x4x5';
  const MOCK_JWT_TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVwZGF2b0BnbWFpbC5jb20iLCJzdWIiOiIyODljOWIzNy01ZDMyLTQ0MTEtODI1Yi0zZmIwNDJmNmI3NDkiLCJpYXQiOjE3Mzg1MTQxMjQsImV4cCI6MTc3MDA1MDEyNH0.ksFMk7IvwJK6CNIJQMpU24CXFll8B44_noNNwmUTr4c';

  const mockUser: User = {
    id: MOCK_USER_ID,
    email: MOCK_USER_EMAIL,
    password: MOCK_USER_PASSWORD_HASH,
    tasks: [],
    validatePassword: jest.fn((password: string) =>
      Promise.resolve(password === MOCK_USER_PASSWORD_PLAIN),
    ),
  } as unknown as User;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue(mockUser),
    login: jest.fn().mockResolvedValue({ access_token: MOCK_JWT_TOKEN }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('debería estar definido', () => {
    expect(authController).toBeDefined();
  });

  it('debería registrar un usuario', async () => {
    const result = await authController.register({
      email: MOCK_USER_EMAIL,
      password: MOCK_USER_PASSWORD_PLAIN,
    });
    expect(result).toEqual(mockUser);
    expect(authService.register).toHaveBeenCalledWith(
      MOCK_USER_EMAIL,
      MOCK_USER_PASSWORD_PLAIN,
    );
  });

  it('debería autenticar un usuario y devolver un JWT', async () => {
    const authDto: AuthDto = {
      email: MOCK_USER_EMAIL,
      password: MOCK_USER_PASSWORD_PLAIN,
      expiresIn: '10d',
    };
    const result = await authController.login(authDto);
    expect(result).toEqual({ access_token: MOCK_JWT_TOKEN });
    expect(authService.login).toHaveBeenCalledWith(authDto);
  });
});
