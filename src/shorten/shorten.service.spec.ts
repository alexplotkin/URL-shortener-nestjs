import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER, CacheModule, Cache } from '@nestjs/cache-manager';
import { ShortenService } from './shorten.service';
import { ShortcodeRepository } from '../database/repos/shortcode.repo';
import { ShortcodeMetricRepository } from '../database/repos/shortcode-metric.repo';
import { NotFoundException } from '@nestjs/common';

describe('ShortenService', () => {
  let service: ShortenService;
  let cacheManager: Cache;
  const mockShortcode1 = 'ABCDE1';
  const mockUrl1 = 'http://example.com';
  const cacheManagerBuffer = {};

  const mockShortcodeRepo = {
    create: jest.fn().mockResolvedValue({
      _id: '1',
      shortCode: mockShortcode1,
      originalUrl: mockUrl1,
    }),
    findOne: jest.fn(),
    findOrThrow: jest.fn().mockResolvedValue({
      _id: '1',
      shortCode: mockShortcode1,
      originalUrl: mockUrl1,
    }),
  };

  const mockShortcodeMetricRepo = {
    create: jest.fn().mockResolvedValue({
      _id: '33',
      shortCodeId: '1',
      hitCount: 0,
    }),
    findOne: jest.fn().mockResolvedValue({
      _id: '33',
      shortCodeId: '1',
      hitCount: 0,
    }),
    findOneAndUpdate: jest.fn(),
    findOrThrow: jest.fn().mockResolvedValue({
      _id: '33',
      shortCodeId: '1',
      hitCount: 0,
    }),
  };

  const mockCacheManager = {
    get: jest.fn().mockImplementation((key) => {
      return cacheManagerBuffer[key];
    }),
    set: jest.fn().mockImplementation((key, value) => {
      cacheManagerBuffer[key] = value;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [
        ShortenService,
        { provide: ShortcodeRepository, useValue: mockShortcodeRepo },
        {
          provide: ShortcodeMetricRepository,
          useValue: mockShortcodeMetricRepo,
        },
      ],
    }).compile();

    service = module.get<ShortenService>(ShortenService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);

    jest.spyOn(cacheManager, 'set').mockImplementation(mockCacheManager.set);
    jest.spyOn(cacheManager, 'get').mockImplementation(mockCacheManager.get);
    jest
      .spyOn(service, 'generateShortCode' as any)
      .mockResolvedValue(mockShortcode1);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a unique shortcode', async () => {
    mockShortcodeRepo.findOne.mockResolvedValue(null);

    const result = await service.createShortCode(mockUrl1);
    expect(result).toEqual(mockShortcode1);
    expect(mockShortcodeRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ originalUrl: mockUrl1 }),
    );
    expect(mockShortcodeMetricRepo.create).toHaveBeenCalled();
    expect(cacheManager.set).toHaveBeenCalledWith(mockShortcode1, mockUrl1);
  });

  describe('getOriginalUrl', () => {
    it('should retrieve the original URL from cache if available', async () => {
      const shortCode = 'ABCDE1';
      const originalUrl = 'http://example.com';
      mockCacheManager.get.mockResolvedValue(originalUrl);

      const result = await service.getOriginalUrl(shortCode);
      expect(result).toEqual(originalUrl);
      expect(mockCacheManager.get).toHaveBeenCalledWith(shortCode);
    });

    it('should retrieve the original URL from DB if not in cache', async () => {
      const shortCode = 'ABCDE1';
      const originalUrl = 'http://example.com';
      mockCacheManager.get.mockResolvedValue(null);
      mockShortcodeRepo.findOrThrow.mockResolvedValue({
        shortCode,
        originalUrl,
      });

      const result = await service.getOriginalUrl(shortCode);
      expect(result).toEqual(originalUrl);
      expect(mockShortcodeRepo.findOrThrow).toHaveBeenCalledWith({ shortCode });
      expect(mockCacheManager.set).toHaveBeenCalledWith(shortCode, originalUrl);
    });
  });

  describe('getShortcodeStats', () => {
    it('should return stats for a shortcode', async () => {
      const shortCode = 'ABCDE1';
      const originalUrl = 'http://example.com';
      const hitCount = 10;
      mockShortcodeRepo.findOrThrow.mockResolvedValue({
        shortCode,
        originalUrl,
      });
      mockShortcodeMetricRepo.findOne.mockResolvedValue({
        hitCount,
      });

      const result = await service.getShortcodeStats(shortCode);
      expect(result).toEqual({
        shortcode: shortCode,
        url: originalUrl,
        hitScore: hitCount,
      });
    });
  });

  describe('error handling', () => {
    it('should throw NotFoundException if shortcode not found', async () => {
      const shortCode = 'unknown';
      jest
        .spyOn(service, 'getOriginalUrl')
        .mockRejectedValueOnce(new NotFoundException('Document was not found'));

      await expect(service.getOriginalUrl(shortCode)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
