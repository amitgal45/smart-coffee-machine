import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IOrder } from "../../../common/interfaces/order.interface";

interface IOrderCoffeeForm{
    isSent:boolean,
    setIsSent:(data:boolean)=>void

    onSubmit:(data:Partial<IOrder>)=>void
}

export const OrderCoffeeForm: FC<IOrderCoffeeForm> = ({isSent,onSubmit,setIsSent}) => {
  const { register, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
  });
  useEffect(() => {

  }, [isSent]);
  if(isSent){
    return (
        <div>
        <h4>Your Order has been received</h4>
        <input type={"button"} onClick={()=>setIsSent(!isSent)} value={"Order Another Coffee"}/>
        </div>
    )
  }
  return (

    <form onSubmit={handleSubmit(onSubmit)}>
        <>
        <div>
      <label htmlFor="coffee_type">Coffee Type</label>
      <select
        id="coffee_type"
        {...register("coffee_type", {
          required: "Please enter your Coffee type.",
        })}
      >
        
        <option value={"capuccino"}>Capuccino</option>
        <option value={"latte"}>Latte</option>
        <option value={"espresso"}>Espresso</option>
      </select>
      </div>
        <div>
      <label htmlFor="isAdmin">Is Manager</label>
      <select
        id="isAdmin"
        {...register("isAdmin", { required: "Please enter your Role." })}
      >
        <option value={"true"}>true</option>
        <option value={"false"}>false</option>
      </select>
      </div>
      <div>
      <label htmlFor="fullname">Full name</label>
      <input
        {...register("fullname", { required: "Please enter your Fullname." })}
        id="fullname"
        type={"text"}
      />
      <input
        {...register("delay")}
        id="delayed"
        type={"datetime-local"}
      />
      </div>
      <input type="submit" value={"Submit"} />
      </>
    </form>
    
  );
};
