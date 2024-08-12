import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game extends Document {
  @Prop({ required: true })
  gameID: string;

  @Prop({ required: true })
  gameName: string;

  @Prop()
  gameImage?: string;

  @Prop()
  gameSlug?: string;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'GameReview' }] })
  reviews?: Types.ObjectId[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
