import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/application/auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/modules/auth/domain/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedpassword',
  firstName: 'Test',
  lastName: 'User',
};

const mockUserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: typeof mockUserRepository;
  let jwtService: typeof mockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user data without password if credentials are valid', async () => {
      userRepository.findOne.mockResolvedValue({ ...mockUser });
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      const result = await service.validateUser({ username: 'testuser', password: 'password' });
      expect(result).toMatchObject({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      });
    });

    it('should return null if credentials are invalid', async () => {
      userRepository.findOne.mockResolvedValue({ ...mockUser });
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      const result = await service.validateUser({ username: 'testuser', password: 'wrong' });
      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      const result = await service.validateUser({ username: 'nouser', password: 'password' });
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access_token for valid credentials', async () => {
      userRepository.findOne.mockResolvedValue({ ...mockUser });
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
      const result = await service.login({ username: 'testuser', password: 'password' });
      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      userRepository.findOne.mockResolvedValue({ ...mockUser });
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);
      await expect(service.login({ username: 'testuser', password: 'wrong' })).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(undefined);
      await expect(service.login({ username: 'nouser', password: 'password' })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should create and return new user if username and email are unique', async () => {
      userRepository.findOne.mockResolvedValueOnce(undefined); // username
      userRepository.findOne.mockResolvedValueOnce(undefined); // email
      userRepository.create.mockReturnValue({ ...mockUser });
      userRepository.save.mockResolvedValue({ ...mockUser });
      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashedpassword');
      const result = await service.register({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
        firstName: 'Test',
        lastName: 'User',
      });
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });
    });

    it('should throw BadRequestException if username exists', async () => {
      userRepository.findOne.mockResolvedValueOnce({ ...mockUser });
      await expect(
        service.register({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
          firstName: 'Test',
          lastName: 'User',
        })
      ).rejects.toThrow('Username already exists');
    });

    it('should throw BadRequestException if email exists', async () => {
      userRepository.findOne.mockResolvedValueOnce(undefined); // username
      userRepository.findOne.mockResolvedValueOnce({ ...mockUser }); // email
      await expect(
        service.register({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password',
          firstName: 'Test',
          lastName: 'User',
        })
      ).rejects.toThrow('Email already exists');
    });
  });
});
