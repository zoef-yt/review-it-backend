import { IsOptional, IsString, IsArray, ValidateNested, IsInt, ValidateIf, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class LikeGenreDTO {
  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.genreName !== undefined || o.genreSlug !== undefined)
  readonly genreID?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.genreID !== undefined || o.genreSlug !== undefined)
  readonly genreName?: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => o.genreID !== undefined || o.genreName !== undefined)
  readonly genreSlug?: string;
}

class GameDTO {
  @IsString()
  @ValidateIf(
    (o) => o.gameName !== undefined || o.gameSlug !== undefined || o.gameImage !== undefined || o.gameID !== undefined,
  )
  readonly gameID: string;

  @IsString()
  @IsOptional()
  @ValidateIf(
    (o) => o.gameID !== undefined || o.gameSlug !== undefined || o.gameImage !== undefined || o.gameName !== undefined,
  )
  readonly gameName?: string;

  @IsString()
  @IsOptional()
  @ValidateIf(
    (o) => o.gameID !== undefined || o.gameName !== undefined || o.gameImage !== undefined || o.gameSlug !== undefined,
  )
  readonly gameImage?: string;

  @IsString()
  @IsOptional()
  @ValidateIf(
    (o) => o.gameID !== undefined || o.gameName !== undefined || o.gameImage !== undefined || o.gameSlug !== undefined,
  )
  readonly gameSlug?: string;
}

class ReviewDTO {
  @IsInt()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  comment?: string;
}

export enum GameActionType {
  ADD = 'add',
  REMOVE = 'remove',
}

class GamesDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LikeGenreDTO)
  @IsOptional()
  readonly likeGenres?: LikeGenreDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GameDTO)
  @IsOptional()
  readonly playedGames?: GameDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GameDTO)
  @IsOptional()
  readonly currentGame?: GameDTO[];

  @IsString()
  @IsEnum(GameActionType, { message: 'Action must be provided' })
  readonly action: GameActionType;
}

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ValidateNested()
  @Type(() => GamesDTO)
  @IsOptional()
  readonly games?: GamesDTO;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewDTO)
  @IsOptional()
  readonly reviews?: ReviewDTO[];
}
