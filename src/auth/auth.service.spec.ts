import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { RegisterDto, LoginDto } from './dtos';
import { mockJwtService } from '../test/test.config';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const hashedPassword = 'hashed-password';
      const mockUser = {
        id: 1,
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      };

      mockUserRepository.findOne.mockResolvedValue(null); // User doesn't exist
      mockedBcrypt.hash.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
      });
    });

    it('should throw ConflictException when user already exists', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const existingUser = { id: 1, email: registerDto.email };
      mockUserRepository.findOne.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'User with this email already exists',
      );
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashed-password';
      const mockUser = {
        id: 1,
        email: loginDto.email,
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        select: ['id', 'email', 'password', 'firstName', 'lastName'],
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 1,
        email: loginDto.email,
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('validateUser', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = 1;
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.validateUser(userId);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        select: ['id', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt'],
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      // Arrange
      const userId = 999;
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.validateUser(userId)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.validateUser(userId)).rejects.toThrow(
        'User not found',
      );
    });
  });
});