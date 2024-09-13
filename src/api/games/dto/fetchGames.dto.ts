import { Transform, Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';

const optionalBooleanMapper = new Map([
  ['undefined', undefined],
  ['true', true],
  ['false', false],
]);

const ParseOptionalBoolean = () => Transform(({ value }) => optionalBooleanMapper.get(value));

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
  @IsString()
  dateRange?: string;

  @IsOptional()
  @IsString()
  ordering?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @ParseOptionalBoolean()
  skipFilter?: boolean;
}

export class FetchSingleGameQueryDto {
  @IsString()
  slug: string;
}
