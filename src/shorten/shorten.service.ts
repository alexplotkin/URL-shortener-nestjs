import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ShortcodeMetricRepository } from '../database/repos/shortcode-metric.repo';
import { ShortcodeRepository } from '../database/repos/shortcode.repo';
import { StatShortcodeResponse } from './response/stat-shortcode.response';

@Injectable()
export class ShortenService {
  constructor(
    private readonly shortcodeRepo: ShortcodeRepository,
    private readonly shortcodeMetricRepo: ShortcodeMetricRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async createShortCode(url: string): Promise<string> {
    const shortCode = await this.generateShortCode();

    const shortcodeDb = await this.shortcodeRepo.create({
      originalUrl: url,
      shortCode,
    });
    await this.shortcodeMetricRepo.create({
      shortCodeId: shortcodeDb._id,
    });

    await this.cacheManager.set(shortcodeDb.shortCode, shortcodeDb.originalUrl);

    return shortCode;
  }

  private async generateShortCode(): Promise<string> {
    const length = 6;
    let code: string;
    let isUnique = false;

    while (!isUnique) {
      code = this.generateRandomCode(length);
      isUnique = await this.checkUniqueness(code);
    }

    return code;
  }

  private generateRandomCode(length: number): string {
    const possibleCharacters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomCode = '';
    for (let i = 0; i < length; i++) {
      randomCode += possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length),
      );
    }
    return randomCode;
  }

  private async checkUniqueness(code: string): Promise<boolean> {
    const existingCode = await this.shortcodeRepo.findOne({ shortCode: code });
    return !existingCode;
  }

  async getOriginalUrl(shortcode: string): Promise<string> {
    const redisUrl = await this.cacheManager.get<string>(shortcode);
    if (redisUrl) return redisUrl;

    const shortcodeDb = await this.shortcodeRepo.findOrThrow({
      shortCode: shortcode,
    });

    await this.cacheManager.set(shortcodeDb.shortCode, shortcodeDb.originalUrl);
    await this.increaseHitCount(shortcodeDb._id);

    return shortcodeDb.originalUrl;
  }

  private async increaseHitCount(shortcodeId) {
    const metric = await this.shortcodeMetricRepo.findOrThrow({
      shortCodeId: shortcodeId,
    });
    await this.shortcodeMetricRepo.findOneAndUpdate(
      { shortCodeId: shortcodeId },
      { hitCount: ++metric.hitCount },
    );
  }

  async getShortcodeStats(shortcode: string): Promise<StatShortcodeResponse> {
    const shortcodeDb = await this.shortcodeRepo.findOrThrow({
      shortCode: shortcode,
    });
    const metricDb = await this.shortcodeMetricRepo.findOne({
      shortCodeId: shortcodeDb._id,
    });
    return {
      shortcode: shortcodeDb.shortCode,
      url: shortcodeDb.originalUrl,
      hitScore: metricDb.hitCount,
    };
  }
}
