// reviews/dto/create-review.dto.ts
import { IsString, IsInt, IsOptional, ValidateIf } from 'class-validator';

export class CreateReviewDTO {
  @IsInt()
  readonly rating: number;

  @IsString()
  @IsOptional()
  readonly comment?: string;

  @IsString()
  @ValidateIf((o) => o.user !== undefined || o.game !== undefined)
  readonly user: string;

  @IsString()
  @ValidateIf((o) => o.user !== undefined || o.game !== undefined)
  readonly game: string;
}
