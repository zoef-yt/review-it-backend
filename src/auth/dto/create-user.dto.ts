import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { ValidateUsernameDTO } from 'src/users/dto/validate-username.dto';

export class CreateUserDto extends ValidateUsernameDTO {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  password: string;
}
