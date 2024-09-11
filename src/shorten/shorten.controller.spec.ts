import { Test, TestingModule } from '@nestjs/testing';
import { ShortenController } from './shorten.controller';
import { ShortenService } from './shorten.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ShortenController', () => {
  let controller: ShortenController;
  let shortenService: ShortenService;
  const mockedShortCode = 'DDDDDD';
  const mockedOriginalUrl = 'http://localhost:5005/website';
  const mockedShortcodeStat = {
    shortcode: mockedShortCode,
    url: mockedOriginalUrl,
    hitScore: 23,
  };
  const mockRequest = {
    protocol: 'http',
    get: (key: string) => {
      const requestInfo = { host: 'localhost:3000' };
      return requestInfo[key];
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenController],
      providers: [
        {
          provide: ShortenService,
          useValue: {
            createShortCode: jest.fn().mockRejectedValue(mockedShortCode),
            getOriginalUrl: jest.fn().mockResolvedValue(mockedOriginalUrl),
            getShortcodeStats: jest.fn().mockResolvedValue(mockedShortcodeStat),
          },
        },
      ],
    }).compile();

    controller = module.get<ShortenController>(ShortenController);
    shortenService = module.get<ShortenService>(ShortenService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createShortCode', () => {
    it('should return a shortened URL successfully', async () => {
      const mockUrl = 'http://example.com';
      const mockShortCode = 'ABCDE1';
      const expectedFullUrl = `http://localhost:3000/shorten/${mockShortCode}`;

      jest
        .spyOn(shortenService, 'createShortCode')
        .mockResolvedValue(mockShortCode);

      const response = await controller.createShortCode(
        mockRequest as any,
        {
          url: mockUrl,
        } as any,
      );
      expect(response.url).toEqual(expectedFullUrl);
      expect(shortenService.createShortCode).toHaveBeenCalledWith(mockUrl);
    });

    it('should throw BadRequestException if the URL is invalid', async () => {
      const invalidUrl = 'invalid-url';

      jest.spyOn(shortenService, 'createShortCode').mockImplementation(() => {
        throw new BadRequestException('url must be in format of url');
      });

      await expect(
        controller.createShortCode(
          mockRequest as any,
          { url: invalidUrl } as any,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getRedirectUrlFromCode', () => {
    it('should redirect to the original URL', async () => {
      const req = { params: { code: mockedShortCode } };
      const res = { redirect: jest.fn() };

      await controller.getRedirectUrlFromCode(req.params.code, res as any);
      expect(res.redirect).toHaveBeenCalledWith(mockedOriginalUrl);
    });

    it('should return 404 if the shortcode is not found', async () => {
      const code = 'unknown';
      jest.spyOn(shortenService, 'getOriginalUrl').mockImplementation(() => {
        throw new NotFoundException();
      });

      const res = { redirect: jest.fn() };
      await expect(
        controller.getRedirectUrlFromCode(code, res as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getShortcodeStats', () => {
    it('should return stats for a shortcode', async () => {
      const code = mockedShortCode;
      const response = await controller.getShortcodeStats(code);
      expect(response).toEqual(mockedShortcodeStat);
      expect(shortenService.getShortcodeStats).toHaveBeenCalledWith(code);
    });

    it('should throw a 404 error if stats are not found for the shortcode', async () => {
      const unknownCode = 'unknown';
      jest.spyOn(shortenService, 'getShortcodeStats').mockImplementation(() => {
        return Promise.reject(new NotFoundException('Document was not found'));
      });
      await expect(controller.getShortcodeStats(unknownCode)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
