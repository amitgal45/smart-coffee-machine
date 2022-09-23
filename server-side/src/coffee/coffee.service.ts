import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { IOrder, Order, StatusType } from 'src/common/entities/order.model';
import { MoreThan, Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('America/New_York');
dayjs().format();

@Injectable()
export class CoffeeService {
  constructor(
    @InjectQueue('coffee-queue')
    private coffeeQueue: Queue<IOrder>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async addNewOrder(body: Partial<IOrder>) {
    try {
      const order = new Order();
      Object.assign(order, {
        ...body,
        status: 'order-received',
        delay: body.delay ?? null,
      });
      const dbOrder = await this.orderRepository.save(order);
      this.coffeeQueue.add('csv', dbOrder, {
        priority: order.isAdmin ? 1 : 0,
        delay: body.delay ? body.delay : undefined,
        attempts: 5,
      });
      return 'Your order has been submitted';
    } catch (err) {
      throw err;
    }
  }

  async getActiveOrder() {
    try {
      const [activejob] = await this.coffeeQueue.getJobs(['active']);
      if (!activejob) return [];
      switch (activejob.progress()) {
        case 0:
          activejob.data.status = StatusType['order-received'];
          break;
        case 1:
          activejob.data.status = StatusType['preparing your coffee'];
          break;
        case 2:
          activejob.data.status = StatusType['packing you coffee'];
          break;
        case 3:
          activejob.data.status = StatusType['Done'];
          break;
      }
      return activejob;
    } catch (err) {
      throw err;
    }
  }

  async findAll() {
    try {
      return this.orderRepository.find({
        order: {
          created_at: 'DESC',
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async findAllLatest30Days() {
    try {
      const date = dayjs().diff(30, 'days');
      const l = dayjs(date).toDate();
      return this.orderRepository.find({
        where: { created_at: MoreThan(l) },
        order: {
          created_at: 'DESC',
        },
      });
    } catch (err) {
      throw err;
    }
  }
}
