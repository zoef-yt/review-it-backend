import { IsEmail, IsString } from 'class-validator';

export class AccountCreatedEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
