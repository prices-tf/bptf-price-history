import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GetHistoryDto, GetHistoryWithIntervalDto } from './dto/get-prices.dto';
import { History } from './entities/history.entity';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get(':sku')
  private paginate(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: GetHistoryDto,
    @Param('sku') sku: string,
  ): Promise<Pagination<History>> {
    return this.historyService.paginate(
      sku,
      {
        page: query.page ?? 1,
        limit: query.limit ?? 100,
      },
      query?.order,
      query?.from,
      query?.to,
    );
  }

  @Get(':sku/interval')
  private async paginateWithInterval(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: GetHistoryWithIntervalDto,
    @Param('sku') sku: string,
  ): Promise<History[]> {
    return this.historyService.intervalPaginated(
      sku,
      query.interval,
      query?.from,
      query?.to,
    );
  }
}
