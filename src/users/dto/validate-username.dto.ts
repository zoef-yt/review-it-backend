import { IsString, Matches, MinLength } from 'class-validator';

export class ValidateUsernameDTO {
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @Matches(/^[^\s@]+$/, { message: 'Username must not contain @' })
  readonly username: string;
}
