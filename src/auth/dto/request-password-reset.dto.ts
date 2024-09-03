import { IsEmail, IsObject, IsString } from 'class-validator';

class UserInfoDto {
  @IsString()
  device: string;

  @IsString()
  ipAddress: string;

  @IsString()
  time: string;
}
export class RequestPasswordResetDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsObject()
  userInfo: UserInfoDto;
}
