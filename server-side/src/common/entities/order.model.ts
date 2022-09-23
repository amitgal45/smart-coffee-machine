import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type CoffeeType = 'latte' | 'capucino' | 'espresso';

export enum StatusType {
  'order-received' = 'order-received',
  'preparing your coffee' = 'preparing your coffee',
  'packing you coffee' = 'packing you coffee',
  'Done' = 'Done',
}

export interface IOrder {
  id?: number;
  coffee_type: CoffeeType;
  status: StatusType;
  delay?: number;
  fullname: string;
  isAdmin: boolean;
  created_at?: Date;
  updated_at?: Date;
}

@Entity()
export class Order implements IOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  coffee_type: CoffeeType;

  @Column()
  status: StatusType = StatusType['order-received'];

  @Column({ nullable: true })
  delay?: number;

  @Column()
  fullname: string;

  @Column()
  isAdmin: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
