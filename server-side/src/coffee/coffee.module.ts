import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/common/entities/order.model';
import { DatabaseModule } from 'src/common/modules/db.module';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';
import { CoffeeProcessor } from './processor/coffee.processor';

@Module({
  providers: [CoffeeProcessor, CoffeeService],
  controllers: [CoffeeController],
  imports: [
    BullModule.forRootAsync({
      // :'sdsd',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
        prefix: 'prefix',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
        limiter: {
          max: 1,
          duration: 10000,
        },
        settings: {
          stalledInterval: 10000,
        },
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueueAsync({
      name: 'coffee-queue',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        name: 'coffee-queue',
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
        prefix: 'prefix',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
        settings: {
          stalledInterval: 10000,
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Order]),
  ],
})
export class CoffeeModule {}
