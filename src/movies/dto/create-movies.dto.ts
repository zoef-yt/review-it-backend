import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  genre: string;

  @IsString()
  @IsOptional()
  releaseDate: string;

  @IsString()
  @IsOptional()
  @Type(() => Number)
  rating: number;

  @IsString()
  @IsOptional()
  director: string;
}
