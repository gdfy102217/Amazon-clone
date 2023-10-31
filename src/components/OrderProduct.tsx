import Image from "next/image";
import React from "react";
import FormattedPrice from "./FormattedPrice";
import { useDispatch } from "react-redux";
import { addToCart, deleteFavorite } from "@/store/nextSlice";
import { OrderItemProps } from "../../type";
interface cartProductProps {
  item: OrderItemProps;
}

const OrderProduct = ({ item }: cartProductProps) => {
  const dispatch = useDispatch();
  return (
    <div className="bg-gray-100 rounded-lg flex flex-col items-center md:flex-row py-1 items-center gap-1">
      <Image src={item.product.image} alt="Product image" width={50} height={50} />
      <div className="grid grid-cols-5 gap-4 px-2 transition duration-200 ease-in-out w-full">
        <div className="col-span-2 flex flex-col gap-1">
            <p className="text-xl font-semibold text-amazon_blue">{item.product.title}</p>
            <p className="text-xs text-gray-600">
            {item.product.brand} {item.product.category}
            </p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
            <span className="font-semibold text-amazon_blue">Price: {item.price}</span>
        </div>
        <div className="col-span-1 flex items-center justify-center">
            <span className="font-semibold text-amazon_blue">Qty: {item.quantity}</span>
        </div>
        <div className="col-span-1 flex items-center justify-center">
            <FormattedPrice amount={item.price * item.quantity} />
        </div>
      </div>
    </div>
  );
};

export default OrderProduct;
