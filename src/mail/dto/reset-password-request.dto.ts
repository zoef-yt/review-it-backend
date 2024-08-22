import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  url: string;
}
