import { ConfigModule, ConfigService } from '@nestjs/config';
import { seconds, ThrottlerAsyncOptions } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

export const ThrottlerOptions: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    storage: new ThrottlerStorageRedisService({
      host: configService.get<string>('redisHost'),
      port: configService.get<number>('redisPort'),
    }),
    throttlers: [
      {
        limit: configService.get<number>('rateLimit'),
        ttl: seconds(configService.get<number>('rateLimitTtl')),
      },
    ],
  }),
  inject: [ConfigService],
};
