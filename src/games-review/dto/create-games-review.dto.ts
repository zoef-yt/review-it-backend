import { IsNumber, IsString, IsOptional, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateGameDto } from 'src/games/dto/create-game.dto';

export class CreateGamesReviewDto {
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(5)
  readonly rating: number;

  @IsString()
  @IsOptional()
  readonly comment: string;

  @IsString()
  readonly gameSlug?: string;

  @IsString()
  readonly userID: string;

  @Type(() => CreateGameDto)
  @ValidateNested()
  readonly game?: CreateGameDto;
}
