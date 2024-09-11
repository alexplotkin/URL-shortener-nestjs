import { Module } from '@nestjs/common';
import { ShortenController } from './shorten.controller';
import { ShortenService } from './shorten.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ShortCode,
  ShortCodeSchema,
} from '../database/models/shortcode.schema';
import {
  ShortCodeMetric,
  ShortCodeMetricSchema,
} from '../database/models/metrics.schema';
import { ShortcodeRepository } from '../database/repos/shortcode.repo';
import { ShortcodeMetricRepository } from '../database/repos/shortcode-metric.repo';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShortCode.name, schema: ShortCodeSchema },
      { name: ShortCodeMetric.name, schema: ShortCodeMetricSchema },
    ]),
  ],
  controllers: [ShortenController],
  providers: [ShortenService, ShortcodeRepository, ShortcodeMetricRepository],
})
export class ShortenModule {}
