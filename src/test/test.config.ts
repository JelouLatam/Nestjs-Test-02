import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from '../todos/entities/task.entity';
import { User } from '../auth/entities/user.entity';

export const testDatabaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:', // In-memory database for tests
  entities: [Task, User],
  synchronize: true,
  logging: false,
  dropSchema: true, // Clean database for each test
};

export const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  invalidatePattern: jest.fn(),
  invalidateUserCache: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
  verify: jest.fn(),
};

export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = {
      'JWT_SECRET': 'test-secret',
      'JWT_EXPIRE': '1h',
    };
    return config[key];
  }),
};