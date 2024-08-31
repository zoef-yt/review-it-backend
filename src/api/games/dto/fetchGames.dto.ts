import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateIf,
  IsBoolean,
} from 'class-validator';

export class FetchGamesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page_size?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsOptional()
  @IsArray({ message: 'dateRange must be an array.' })
  @ArrayMinSize(2, { message: 'dateRange must have exactly two dates.' })
  @ArrayMaxSize(2, { message: 'dateRange must have exactly two dates.' })
  @ValidateIf((o) => o.dateRange && o.dateRange.length === 2)
  dateRange?: [string, string];

  @IsOptional()
  @IsString()
  ordering?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  skipFilter?: boolean;
}

export class FetchSingleGameQueryDto {
  @IsString()
  slug: string;
}
