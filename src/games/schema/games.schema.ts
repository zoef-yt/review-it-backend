import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game extends Document {
  @Prop()
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Review' }] })
  reviews: Types.ObjectId[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
