import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQWrapperModule } from '../rabbitmq-wrapper/rabbitmq-wrapper.module';
import { History } from './entities/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History]), RabbitMQWrapperModule],
  providers: [HistoryService],
  controllers: [HistoryController],
})
export class HistoryModule {}
