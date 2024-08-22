import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { GamesReviews } from 'src/games-review/schema/games-review.schema';
import { Game } from 'src/games/schema/games.schema';

export type UserDocument = User & Document;

@Schema()
class LikedGamesGenre {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;
}

export const LikeGenreSchema = SchemaFactory.createForClass(LikedGamesGenre);

@Schema()
export class User {
  @Prop()
  name?: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  lastLogin: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [LikeGenreSchema], default: [] })
  likedGamesGenres?: LikedGamesGenre[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Game.name }] })
  playedGames: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Game.name }] })
  currentGame: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: GamesReviews.name }] })
  gamesReviews: Types.ObjectId[];

  @Prop({ default: null })
  resetToken: string;

  @Prop({ default: null })
  resetTokenExpiry: Date;

  @Prop({ default: null })
  tokensInvalidatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
