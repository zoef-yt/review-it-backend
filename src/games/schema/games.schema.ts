import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game extends Document {
  @Prop({ required: true, unique: true })
  gameID: string;

  @Prop({ required: true })
  gameName: string;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  reviewsCount: number;

  @Prop()
  gameImage?: string;

  @Prop({ required: true, unique: true })
  gameSlug?: string;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'GamesReview' }] })
  reviews?: Types.ObjectId[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
