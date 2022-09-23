export interface IOrder {
  id?: number;
  coffee_type: CoffeeType;
  status: StatusType;
  delay?: number|Date;
  quantity: number;
  fullname: string;
  isAdmin: boolean;
}

export type CoffeeType = "latte" | "capucino" | "espresso";

export type StatusType =
  | "order-received"
  | "preparing your coffee"
  | "packing you coffee"
  | "Done";
