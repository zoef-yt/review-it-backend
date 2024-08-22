import { IsString, ValidateIf, IsEmail, IsDefined } from 'class-validator';

export class LoginUserDto {
  @ValidateIf((o) => !o.username)
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @IsString()
  password: string;

  @ValidateIf((o) => !o.email && !o.username)
  @IsDefined({ message: 'Either email or username must be provided' })
  dummyValidation: any;
}
