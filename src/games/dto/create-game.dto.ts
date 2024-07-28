import { IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  name: string;
}
