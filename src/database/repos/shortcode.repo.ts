import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../../utils/database/abstract.repository';
import { ShortCode } from '../models/shortcode.schema';

@Injectable()
export class ShortcodeRepository extends AbstractRepository<ShortCode> {
  protected readonly logger = new Logger(ShortcodeRepository.name);

  constructor(
    @InjectModel(ShortCode.name)
    reservationModel: Model<ShortCode>,
  ) {
    super(reservationModel);
  }
}
