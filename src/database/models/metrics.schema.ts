import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AbstractDocument } from '../../utils/database/abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class ShortCodeMetric extends AbstractDocument {
  @Prop({ type: Types.ObjectId, ref: 'ShortCode', required: true, index: true })
  shortCodeId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  hitCount?: number;
}

export const ShortCodeMetricSchema =
  SchemaFactory.createForClass(ShortCodeMetric);
