/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

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

  const mockUserRepository = {
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    findOne: jest.fn().mockResolvedValue(mockUser),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue(MOCK_JWT_TOKEN),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('debería registrar un usuario', async () => {
    // eslint-disable-next-line @typescript-eslint/require-await
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => {
      return MOCK_USER_PASSWORD_HASH;
    });

    const result = await authService.register(
      MOCK_USER_EMAIL,
      MOCK_USER_PASSWORD_PLAIN,
    );
    expect(result).toEqual(mockUser);
    expect(userRepository.save).toHaveBeenCalled();
  });

  it('debería autenticar un usuario', async () => {
    const authDto: AuthDto = {
      email: MOCK_USER_EMAIL,
      password: MOCK_USER_PASSWORD_PLAIN,
      expiresIn: '10d',
    };
    const result = await authService.login(authDto);
    expect(result).toEqual({ access_token: MOCK_JWT_TOKEN });
  });

  it('debería lanzar un error si las credenciales son incorrectas', async () => {
    jest.spyOn(mockUser, 'validatePassword').mockResolvedValue(false);
    const authDto: AuthDto = {
      email: 'wrong@example.com',
      password: 'wrongpass',
      expiresIn: '10d',
    };
    await expect(authService.login(authDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
