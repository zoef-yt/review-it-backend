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

GamesReviewSchema.post('save', async function (doc) {
  const gameId = doc.gameID;

  const result = await this.model('GamesReviews').aggregate([
    { $match: { gameID: gameId } },
    {
      $group: {
        _id: '$gameID',
        averageRating: { $avg: '$rating' },
        reviewsCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        averageRating: { $round: ['$averageRating', 1] },
        reviewsCount: 1,
      },
    },
  ]);
  if (result.length > 0) {
    const { averageRating, reviewsCount } = result[0];
    await this.model('Game').updateOne({ _id: gameId }, { $set: { averageRating, reviewsCount } });
  }
});
