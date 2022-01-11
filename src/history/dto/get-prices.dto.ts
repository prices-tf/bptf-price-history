import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';

enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class GetHistoryDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly page?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly limit?: number;

  @IsEnum(OrderEnum)
  readonly order?: OrderEnum;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly from?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly to?: Date;
}

export class GetHistoryWithIntervalDto extends GetHistoryDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly interval?: number;
}
