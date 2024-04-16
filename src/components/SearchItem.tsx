import Link from "next/link";
import FormattedPrice from "@/components/FormattedPrice";
import React from "react";
import { Rating } from "@mui/material";

// @ts-ignore
const SearchItem = ({key, item, agentId, taskId}) => {
  return <div key={key} className="border border-gray-300 flex-none p-4 w-1/4 max-w-xs m-4 rounded-lg">
    <Link href={{
      pathname: `/product/${item._id}`,
      query: {
        _id: item._id,
        brand: item.brand,
        category: item.category,
        description: item.description,
        image: item.image,
        isNew: item.isNew,
        oldPrice: item.oldPrice,
        price: item.price,
        title: item.title,
        agentId: agentId,
        taskId: taskId,
      },
    }} className="flex flex-col items-center gap-4 h-full border hover:bg-gray-300">
      <img className="w-full" src={item.image} alt="productImage"/>
      <div>
        <p className="text-xs -mb-1">
          {item.brand}_{item.category}
        </p>
        <p className="text-lg font-medium">{item.title.substring(0, 20)}</p>
        <Rating
          name="half-rating-react"
          value={5}
          precision={0.5}
          readOnly
          size={"small"}
          style={{color: "#FACF19 "}}
        />
        <span className="ml-3 text-xs text-slate-700">{`3 reviews`}</span>
        <p className="text-xs">{item.description.substring(0, 100)}</p>
        <p className="text-sm flex items-center gap-1">
          price:{" "}
          <span className="font-semibold">
                  <FormattedPrice amount={item.price}/>
                </span>
          <span className="text-gray-600 line-through">
                  <FormattedPrice amount={item.oldPrice}/>
                </span>
        </p>
      </div>
    </Link>
  </div>
}

export default SearchItem;