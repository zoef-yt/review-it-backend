import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = GameReview & Document;

@Schema()
export class GameReview {
  @Prop({ required: true })
  rating: number;

  @Prop()
  comment?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userID: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Game', required: true })
  game: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(GameReview);
