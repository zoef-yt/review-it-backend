import { IsString, IsObject } from 'class-validator';

class UserInfoDto {
  @IsString()
  device: string;

  @IsString()
  ipAddress: string;

  @IsString()
  loginTime: string;
}
export class LoginUserDto {
  @IsString()
  usernameOrEmail: string;

  @IsString()
  password: string;

  @IsObject()
  userInfo: UserInfoDto;
}
