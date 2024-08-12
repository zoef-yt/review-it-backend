import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
class LikeGenre {
  @Prop({ required: true })
  genreID: string;

  @Prop({ required: true })
  genreName: string;

  @Prop({ required: true })
  genreSlug: string;
}

export const LikeGenreSchema = SchemaFactory.createForClass(LikeGenre);

@Schema()
class Game {
  @Prop({ required: true })
  gameID: string;

  @Prop({ required: true })
  gameName?: string;

  @Prop({ required: true })
  gameImage?: string;

  @Prop({ required: true })
  gameSlug?: string;
}

export const PlayedGameSchema = SchemaFactory.createForClass(Game);

@Schema()
class UserGames {
  @Prop({ type: [LikeGenreSchema], default: [] })
  likeGenres?: LikeGenre[];

  @Prop({ type: [PlayedGameSchema], default: [] })
  playedGames?: Game[];

  @Prop({ type: [PlayedGameSchema], default: [] })
  currentGame?: Game[];
}

export const UserGamesSchema = SchemaFactory.createForClass(UserGames);

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: Date.now })
  lastLogin: Date;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop()
  name?: string;

  @Prop({ type: UserGamesSchema, default: () => ({}) })
  games?: UserGames;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'GameReview' }] })
  reviews: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
