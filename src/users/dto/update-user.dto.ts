import { IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  lastLogin?: Date;

  @IsOptional()
  password?: string;

  @IsOptional()
  resetToken?: string;

  @IsOptional()
  resetTokenExpiry?: Date;

  @IsOptional()
  tokensInvalidatedAt?: Date;
}
