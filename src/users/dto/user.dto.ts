import { Types } from 'mongoose';

interface Game {
  gameID: string;
  gameName?: string;
  gameImage?: string;
  gameSlug?: string;
}

interface GameReview {
  _id: Types.ObjectId;
  rating: number;
  comment?: string;
  game: Game;
}

interface LikeGenre {
  genreID: string;
  genreName: string;
  genreSlug: string;
}

interface UserGames {
  likeGenres: LikeGenre[];
  playedGames: Game[];
  currentGame: Game[];
}

export interface UserDTO {
  _id: Types.ObjectId;
  lastLogin: Date;
  email: string;
  createdAt: Date;
  name?: string;
  games?: UserGames | undefined;
  reviews: GameReview[];
}
