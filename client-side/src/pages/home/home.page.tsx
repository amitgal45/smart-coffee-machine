import { DataGrid, GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { FC, useCallback, useEffect, useState } from "react";
import { IOrder } from "../../common/interfaces/order.interface";
import orderService from "../../common/service/order.service";
import OrderService from "../../common/service/order.service";
import { OrderCoffeeForm } from "./components/order-coffee-form.component";
import dayjs from 'dayjs'
import  relativeTime from 'dayjs/plugin/relativeTime'
import  utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.tz.setDefault("America/New_York")
dayjs.extend(relativeTime)
dayjs().format();

const columnsMOCK: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150 },
  { field: "fullname", headerName: "Fullname", width: 150 },
  { field: "coffee_type", headerName: "Coffee Type", width: 150 },
  { field: "created_at", headerName: "Created at", width: 150 },
  { field: "status", headerName: "Order Status", width: 150 },
];

export const HomePage: FC = () => {
  const [active_order, setActiveOrder] = useState<IOrder>({} as any);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [lastMonthRows, setLastMonthRows] = useState<GridRowsProp>([]);
  const [lastMonthColumns, setLastMonthColumns] = useState<GridColDef[]>([]);
  const [isSent, setIsSent] = useState(false);

  const onSubmit = async (data: Partial<IOrder>) => {
    data.delay=0
    if(data.delay)
        data.delay = dayjs(data.delay).diff(dayjs())
    
    await orderService.create(data);
    setIsSent(true);
  };

  const getAllOrders = useCallback(() => {
    return OrderService.getAll().then((orders) => {
      setRows(orders.data);
      setColumns(columnsMOCK);
    });
  }, []);

  const getActive = useCallback(() => {
    return OrderService.getActive().then((order) => {
      const active = order.data.data ?? ({} as any);
      setActiveOrder(active);
    });
  }, []);

  const getLastMonthOrders = useCallback(() => {
    return OrderService.getLatestMonthOrders().then((orders) => {
        setLastMonthRows(orders.data)
        setLastMonthColumns(columnsMOCK);
    });
  }, []);


  useEffect(() => {
    getAllOrders();
    getActive();
    getLastMonthOrders()
  }, [isSent]);

  return (
    <div style={{ height: 300, width: "70%", minWidth: 750, margin: "auto" }}>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexDirection: "column" ,flex:1}}>
          <h1>Add Order Form:</h1>
          <OrderCoffeeForm onSubmit={onSubmit} isSent={isSent} setIsSent={setIsSent}/>
        </div>
        <div style={{ display: "flex", flexDirection: "column",flex:1 }}>
          {active_order.id && (
            <>
              <h1>Active Order</h1>
              <div>
                <p> ID:{active_order.id}</p>
                <p> Type:{active_order.coffee_type}</p>
                <p> Status:{active_order.status}</p>
                <p> Ordered By:{active_order.fullname}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <h1>Last Month Orders:</h1>
      <DataGrid
        rows={lastMonthRows}
        columns={lastMonthColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />

      <h1>All Orders:</h1>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
};
