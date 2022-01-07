import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GetHistoryDto } from './dto/get-prices.dto';
import { History } from './entities/history.entity';
import { HistoryService } from './history.service';

@Controller('history/:sku')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
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
    );
  }
}
