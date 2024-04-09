'use client';
import React, { useState, useEffect } from 'react'
import prismadb from '@/libs/prismadb';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux";
import { StateProps, StoreProduct, ProductProps } from "../../../type";
import Products from '@/components/Products';
import FormattedPrice from "@/components/FormattedPrice";
import CustomSearchPanel from "@/components/CustomSearchPanel";
import Fuse from 'fuse.js';
import useEventTracker, { EventMetaData }  from "@/pages/hooks/useEventTracker";
import { useAgentTask } from "@/contexts/agentTaskContext";


const Index = () => {
    const { agentId, taskId } = useAgentTask();
    const { trackEvent } = useEventTracker();

    const router = useRouter();
    const path = router.pathname;
    const { query } = router;
    const { productData, favoriteData, userInfo, allProducts } = useSelector(
      (state: StateProps) => state.next
    );
    const [allData, setAllData] = useState(allProducts.allProducts);
    const [searchQuery, setSearchQuery] = useState(query.search? query.search as string : "");

    const [filteredProducts, setFilteredProducts] = useState<StoreProduct[]>([]);;

    useEffect(() => {
      setAllData(allProducts.allProducts);
    }, [allProducts]);
    useEffect(() => {
      const options = {
        keys: ['title'],
        includeScore: true,
        threshold: 0.6, // Adjust this value to control the fuzziness, lower means more strict
      };

      if (query.search){
        setSearchQuery(query.search as string);
        // const filtered = allData.filter((item: StoreProduct) =>
        //   item.title.toLocaleLowerCase().includes((query.search as string).toLowerCase())
        // );
        // setFilteredProducts(filtered);

        const fuse = new Fuse<StoreProduct>(allData, options);
        const result = fuse.search(query.search as string);

        const filtered = result.map(({ item }: { item: StoreProduct }) => item);
        setFilteredProducts(filtered);
      }
    }, [query, allData]);
  
  return (
    <div className='bg-white'>
      <div>
        <CustomSearchPanel />
      </div>
      {/* <Products productData={filteredProducts} /> */}
      <div className='flex flex-col gap-2 w-3/5 mx-auto'>
      {filteredProducts.map((item: ProductProps) => (
        <div key={item._id}>
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
                }} className="flex items-center gap-4 border hover:bg-gray-300">
            <img className="w-24" src={item.image} alt="productImage" />
            <div>
              <p className="text-xs -mb-1">
                {item.brand}_{item.category}
              </p>
              <p className="text-lg font-medium">{item.title}</p>
              <p className="text-xs">{item.description.substring(0, 100)}</p>
              <p className="text-sm flex items-center gap-1">
                price:{" "}
                <span className="font-semibold">
                  <FormattedPrice amount={item.price} />
                </span>
                <span className="text-gray-600 line-through">
                  <FormattedPrice amount={item.oldPrice} />
                </span>
              </p>
            </div>
          </Link>
        </div>
      ))}
      </div>
    </div>
  )
}

export default Index