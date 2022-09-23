import { AxiosResponse } from "axios";
import { IOrder } from "../interfaces/order.interface";
import axios from "./axios.service";

class OrderService {
  getAll():Promise<AxiosResponse<IOrder[]>> {
    return axios.get<Array<IOrder>>("/coffee");
  }

  getActive():Promise<AxiosResponse<any>> {
    return axios.get<any>(`/coffee/active`);
  }

  create(data: Partial<IOrder>) {
    return axios.post<IOrder>("/coffee", data);
  }

  getLatestMonthOrders() {
    return axios.get<Array<IOrder>>(`/coffee/last-month`);
  }
}

export default new OrderService();