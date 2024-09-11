import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ShortenModule } from './shorten/shorten.module';
import DatabaseModule from './database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './config/redis.options';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerOptions } from './config/throttler.redis.options';
import { ConfigModuleOpt } from './config/config.options';
import { PinoLoggerOptions } from './config/pino-logger.options';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    PinoLoggerModule.forRoot(PinoLoggerOptions),
    ConfigModule.forRoot(ConfigModuleOpt),
    CacheModule.registerAsync(RedisOptions),
    ThrottlerModule.forRootAsync(ThrottlerOptions),
    ShortenModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
