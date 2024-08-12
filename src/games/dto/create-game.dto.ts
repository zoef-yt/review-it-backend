import { IsString, IsOptional } from 'class-validator';

export class CreateGameDto {
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
