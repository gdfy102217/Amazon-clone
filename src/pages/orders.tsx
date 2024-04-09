"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { StateProps, StoreProduct } from "../../type";
import FavoriteProduct from "@/components/FavoriteProduct";
import ResetFavoriteItems from "@/components/ResetFavoriteItems";
import Link from "next/link";
import { useUser } from "@clerk/clerk-react";
import { OrderProps } from "../../type";
import OrderProduct from "@/components/OrderProduct";
import { format } from 'date-fns';
import useEventTracker, { EventMetaData }  from "@/pages/hooks/useEventTracker";
import { useAgentTask } from "@/contexts/agentTaskContext";


const OrderPage = () => {
  const { user } = useUser();
  const { favoriteData } = useSelector((state: StateProps) => state.next);
  const [orderData, setOrderData] = useState<OrderProps[]>([]);

  const { agentId, taskId } = useAgentTask();
  const { trackEvent } = useEventTracker();

  trackEvent({
    app: 'amazon',
    type: `task_${taskId}`,
    elementId: `visit_order`,
    msg: `visit orders page`,
    agentId: agentId,
    taskId: taskId,
    urlPath: window.location.pathname,
    timestamp: Date.now(),
  } as  EventMetaData);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = user?.id;
      const response = await fetch(`/api/get-orders?userId=${userId}`);
      const ordersData = await response.json();
      setOrderData(ordersData);
      console.log(orderData)
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="max-w-screen-xl mx-auto px-6 gap-10 py-4">
      {orderData.length > 0 ? (
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center justify-between border-b-[1px] border-b-gray-400 pb-1">
            <p className="text-2xl font-semibold text-amazon_blue">
              Orders
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            {orderData.map((item: OrderProps) => (
              <div key={item.id} className=" border p-2 rounded">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-amazon_blue">
                    Order ID: {item.id}
                  </p>
                  <p className="text-lg font-semibold text-amazon_blue">
                    {format(new Date(item.createdAt), 'MMM do, yyyy h:mm a')}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  {item.orderItems.map((item: any) => (
                    <div key={item.id}>
                      <OrderProduct item={item} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <p className="text-lg font-semibold text-amazon_blue">
                    Total: {item.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white h-96  flex flex-col items-center justify-center py-5 rounded-lg shadow-lg">
          <h1>No order history</h1>
          <Link href="/">
            <button className="w-52 h-10 bg-amazon_blue text-white rounded-lg text-sm font-semibold hover:bg-amazon_yellow hover:text-black duration-300 mt-2">
              go to shopping
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
