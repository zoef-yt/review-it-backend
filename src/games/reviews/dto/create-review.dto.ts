import { IsString, IsOptional, ValidateNested, IsNumber, Min, Max, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

class GameDTO {
  @IsString()
  gameID: string;

  @IsString()
  @IsOptional()
  gameName?: string;

  @IsString()
  @IsOptional()
  gameImage?: string;

  @IsString()
  @IsOptional()
  gameSlug?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateReviewDTO {
  @IsNumber()
  @Min(0)
  @Max(5)
  readonly rating: number;

  @IsString()
  @IsOptional()
  @MaxLength(400)
  readonly comment?: string;

  @IsString()
  readonly userID: string;

  @ValidateNested()
  @Type(() => GameDTO)
  readonly game: GameDTO;
}
