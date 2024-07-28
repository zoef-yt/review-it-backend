import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsDateString()
  @IsOptional()
  releaseDate?: string;
}
