import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>('redisHost'),
        port: configService.get<number>('redisPort'),
      },
      ttl: configService.get<number>('cacheTtl'),
    });
    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};
