import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
