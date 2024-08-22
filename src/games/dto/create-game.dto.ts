import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';

class GenreDto {
  @IsString()
  id: string;

  @IsString()
  name: string;
}

export class CreateGameDto {
  @IsString()
  gameID: string;

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
