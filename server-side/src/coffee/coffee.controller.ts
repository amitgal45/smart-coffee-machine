import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { IOrder } from 'src/common/entities/order.model';
import { CoffeeService } from './coffee.service';

@Controller('coffee')
export class CoffeeController {
  constructor(private coffeeService: CoffeeService) {}

  @Post()
  async makeCoffeeOrder(@Body() body: Partial<IOrder>) {
    try {
      return await this.coffeeService.addNewOrder(body);
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  @Get('active')
  async getActiveOrder() {
    try {
      return await this.coffeeService.getActiveOrder();
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  @Get()
  async get() {
    try {
      return await this.coffeeService.findAll();
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }

  @Get('last-month')
  async getLastMonthOrders() {
    try {
      return await this.coffeeService.findAllLatest30Days();
    } catch (err) {
      throw new HttpException(err.message, 400);
    }
  }
}
