import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;
  let cacheManager: Cache;

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
    store: {
      keys: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should retrieve value from cache', async () => {
      // Arrange
      const key = 'test-key';
      const value = { data: 'test-data' };
      mockCacheManager.get.mockResolvedValue(value);

      // Act
      const result = await service.get(key);

      // Assert
      expect(mockCacheManager.get).toHaveBeenCalledWith(key);
      expect(result).toEqual(value);
    });

    it('should return null when key does not exist', async () => {
      // Arrange
      const key = 'nonexistent-key';
      mockCacheManager.get.mockResolvedValue(null);

      // Act
      const result = await service.get(key);

      // Assert
      expect(mockCacheManager.get).toHaveBeenCalledWith(key);
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set value in cache with default TTL', async () => {
      // Arrange
      const key = 'test-key';
      const value = { data: 'test-data' };
      mockCacheManager.set.mockResolvedValue(undefined);

      // Act
      await service.set(key, value);

      // Assert
      expect(mockCacheManager.set).toHaveBeenCalledWith(key, value, 300); // 5 minutes default (300 seconds)
    });

    it('should set value in cache with custom TTL', async () => {
      // Arrange
      const key = 'test-key';
      const value = { data: 'test-data' };
      const ttl = 600; // 10 minutes
      mockCacheManager.set.mockResolvedValue(undefined);

      // Act
      await service.set(key, value, ttl);

      // Assert
      expect(mockCacheManager.set).toHaveBeenCalledWith(key, value, ttl);
    });
  });

  describe('del', () => {
    it('should delete value from cache', async () => {
      // Arrange
      const key = 'test-key';
      mockCacheManager.del.mockResolvedValue(undefined);

      // Act
      await service.del(key);

      // Assert
      expect(mockCacheManager.del).toHaveBeenCalledWith(key);
    });
  });

  describe('invalidatePattern', () => {
    it('should invalidate cache keys matching pattern', async () => {
      // Arrange
      const pattern = '*user_1*';
      const matchingKeys = ['user_1_tasks', 'user_1_profile'];
      mockCacheManager.store.keys.mockResolvedValue(['user_1_tasks', 'user_1_profile', 'user_2_tasks']);
      mockCacheManager.del.mockResolvedValue(undefined);

      // Act
      await service.invalidatePattern(pattern);

      // Assert
      expect(mockCacheManager.del).toHaveBeenCalledWith('user_1_tasks');
      expect(mockCacheManager.del).toHaveBeenCalledWith('user_1_profile');
      expect(mockCacheManager.del).not.toHaveBeenCalledWith('user_2_tasks');
    });

    it('should handle empty pattern matches', async () => {
      // Arrange
      const pattern = '*nonexistent*';
      mockCacheManager.store.keys.mockResolvedValue([]);

      // Act
      await service.invalidatePattern(pattern);

      // Assert
      expect(mockCacheManager.del).not.toHaveBeenCalled();
    });
  });

  describe('invalidateUserCache', () => {
    it('should invalidate user-specific cache keys', async () => {
      // Arrange
      const userId = 1;
      const allKeys = ['user_1_tasks', 'user_1_profile', 'user_2_tasks'];
      mockCacheManager.store.keys.mockResolvedValue(allKeys);
      mockCacheManager.del.mockResolvedValue(undefined);

      // Act
      await service.invalidateUserCache(userId);

      // Assert
      expect(mockCacheManager.del).toHaveBeenCalledWith('user_1_tasks');
      expect(mockCacheManager.del).toHaveBeenCalledWith('user_1_profile');
      expect(mockCacheManager.del).not.toHaveBeenCalledWith('user_2_tasks');
    });

    it('should handle store without keys method', async () => {
      // Arrange
      const userId = 1;
      mockCacheManager.store = {};

      // Act & Assert - should not throw error
      await expect(service.invalidateUserCache(userId)).resolves.toBeUndefined();
    });
  });
});