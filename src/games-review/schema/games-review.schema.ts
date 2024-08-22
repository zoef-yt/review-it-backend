import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GamesReviewsDocument = GamesReviews & Document;

@Schema()
export class GamesReviews extends Document {
  @Prop({ required: true })
  rating: number;

  @Prop()
  comment: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Game' })
  gameID: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userID: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const GamesReviewSchema = SchemaFactory.createForClass(GamesReviews);
