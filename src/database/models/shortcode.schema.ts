import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../utils/database/abstract.schema';

@Schema({ versionKey: false, timestamps: true })
export class ShortCode extends AbstractDocument {
  @Prop({ required: true, unique: true })
  shortCode: string;

  @Prop({ required: true })
  originalUrl: string;
}

export const ShortCodeSchema = SchemaFactory.createForClass(ShortCode);
