import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';

class GenreDto {
  @Type(() => Number)
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class CreateGameDto {
  @IsNumber()
  @Type(() => Number)
  gameID: number;

  @IsString()
  gameName: string;

  @IsString()
  gameImage: string;

  @IsString()
  gameSlug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => GenreDto)
  genre?: GenreDto[];
}
