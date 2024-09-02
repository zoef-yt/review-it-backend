import { IsString, ValidateIf, IsEmail, IsDefined, IsObject } from 'class-validator';

class UserInfoDto {
  @IsString()
  device: string;

  @IsString()
  ipAddress: string;

  @IsString()
  loginTime: string;
}
export class LoginUserDto {
  @ValidateIf((o) => !o.username)
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @IsString()
  password: string;

  @IsObject()
  userInfo: UserInfoDto;

  @ValidateIf((o) => !o.email && !o.username)
  @IsDefined({ message: 'Either email or username must be provided' })
  dummyValidation: any;
}
