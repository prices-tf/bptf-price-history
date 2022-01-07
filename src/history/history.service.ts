import {
  AmqpConnection,
  RabbitSubscribe,
  requeueErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import {
  Connection,
  FindConditions,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { History } from './entities/history.entity';
import { Price } from './interfaces/price.interface';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly repository: Repository<History>,
    private readonly amqpConnection: AmqpConnection,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  @RabbitSubscribe({
    exchange: 'bptf-price.updated',
    routingKey: '*',
    queue: 'saveBptfPriceInHistory',
    queueOptions: {
      arguments: {
        'x-queue-type': 'quorum',
      },
    },
    errorHandler: requeueErrorHandler,
  })
  private async handlePrice(price: Price): Promise<void> {
    const history = await this.connection.transaction(
      async (transactionalEntityManager) => {
        // Find most recent price for this item
        const mostRecent = await transactionalEntityManager.findOne(History, {
          order: {
            createdAt: 'DESC',
          },
          where: {
            sku: price.sku,
          },
        });

        if (mostRecent) {
          // Found previous price
          if (
            mostRecent.createdAt.getTime() >=
            new Date(price.updatedAt).getTime()
          ) {
            // Current price in database is older than price from event
            return;
          } else if (
            mostRecent.sellKeys === price.sellKeys &&
            mostRecent.sellHalfScrap === price.sellHalfScrap &&
            mostRecent.buyKeys === price.buyKeys &&
            mostRecent.buyHalfScrap === price.buyHalfScrap
          ) {
            // Price in database is same as price from event
            return;
          }
        }

        // Price updated, save new price to database

        const history = transactionalEntityManager.create(History, {
          sku: price.sku,
          buyHalfScrap: price.buyHalfScrap,
          buyKeys: price.buyKeys,
          sellHalfScrap: price.sellHalfScrap,
          sellKeys: price.sellKeys,
          createdAt: price.updatedAt,
        });

        // Save the price
        await transactionalEntityManager.save(history);

        return history;
      },
    );

    // Publish new price to rabbitmq
    await this.amqpConnection.publish(
      'bptf-price-history.created',
      '*',
      history,
    );
  }

  paginate(
    sku: string,
    options: IPaginationOptions,
    order: 'ASC' | 'DESC',
    from?: Date,
  ): Promise<Pagination<History>> {
    const where: FindConditions<History> = {
      sku,
    };

    if (from) {
      where.createdAt =
        order === 'ASC' ? MoreThanOrEqual(from) : LessThanOrEqual(from);
    }

    return paginate<History>(this.repository, options, {
      order: {
        createdAt: order,
      },
      where,
    });
  }
}
