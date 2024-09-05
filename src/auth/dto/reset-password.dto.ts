import { IsString, IsNotEmpty, MinLength, IsEmail, IsObject } from 'class-validator';

class UserInfoDto {
  @IsString()
  device: string;

  @IsString()
  ipAddress: string;

  @IsString()
  time: string;
}

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

  @IsObject()
  userInfo: UserInfoDto;
}
