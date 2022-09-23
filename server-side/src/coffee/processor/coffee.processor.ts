import {  Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { IOrder, Order, StatusType } from 'src/common/entities/order.model';
import { Repository } from 'typeorm';

@Processor('coffee-queue')
export class CoffeeProcessor {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  private async updateMode(status: StatusType, orderId: number, time: number,job?:Job<unknown>) {
    try {
      return new Promise((resolve, reject) => {
        switch(status){
          case StatusType['preparing your coffee']: job.progress(0); break;
          case StatusType['packing you coffee']: job.progress(1); break;
          case StatusType['Done']: job.progress(2); break;
        }
        setTimeout(async () => {
          await this.orderRepository.update({ id: orderId }, { status });
          resolve('anything');
        }, time);
      });
    } catch (err) {
      throw err;
    }
  }

  @Process('csv')
  async handleCoffeeOrder(job: Job<IOrder>, done) {
    try {
        this.updateMode(StatusType['preparing your coffee'], job.data.id, 10000,job)
          .then(() => this.updateMode(StatusType['packing you coffee'], job.data.id, 10000,job))
          .then(() => this.updateMode(StatusType['Done'], job.data.id, 10000,job))
          .then(()=>{
            job.moveToCompleted('done',true)
            done()
          });
    } catch (err) {
      await job.moveToFailed({ message: 'job failed' });
      throw err;
    }
  }
}
