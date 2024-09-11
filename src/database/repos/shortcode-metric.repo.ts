import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../../utils/database/abstract.repository';
import { ShortCodeMetric } from '../models/metrics.schema';

@Injectable()
export class ShortcodeMetricRepository extends AbstractRepository<ShortCodeMetric> {
  protected readonly logger = new Logger(ShortcodeMetricRepository.name);

  constructor(
    @InjectModel(ShortCodeMetric.name)
    reservationModel: Model<ShortCodeMetric>,
  ) {
    super(reservationModel);
  }
}
