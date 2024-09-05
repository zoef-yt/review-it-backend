import { IsObject, IsString, Matches, MinLength } from 'class-validator';

class UserInfoDto {
  @IsString()
  device: string;

  @IsString()
  ipAddress: string;

  @IsString()
  time: string;
}
export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  newPassword: string;

  @IsObject()
  userInfo: UserInfoDto;
}
