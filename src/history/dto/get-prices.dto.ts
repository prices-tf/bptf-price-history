import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { IsGreater } from '../../common/decorators/is-greater.decorator';
import { IsSmaller } from '../../common/decorators/is-smaller.decorator';

enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

class BaseHistoryDto {
  @IsOptional()
  @IsDate()
  @IsSmaller('to')
  @Type(() => Date)
  readonly from?: Date;

  @IsOptional()
  @IsDate()
  @IsGreater('from')
  @Type(() => Date)
  readonly to?: Date;
}

export class GetHistoryDto extends BaseHistoryDto {
  @IsEnum(OrderEnum)
  readonly order?: OrderEnum;

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
}

export class GetHistoryWithIntervalDto extends BaseHistoryDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  readonly interval?: number;
}
