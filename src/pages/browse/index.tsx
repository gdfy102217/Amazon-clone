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
import SearchItem from "@/components/SearchItem";

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
      {/*<div>*/}
      {/*  <CustomSearchPanel />*/}
      {/*</div>*/}
      {/* <Products productData={filteredProducts} /> */}
      <div className='flex flex-row flex-wrap gap-2'>
      {filteredProducts.map((item: ProductProps) => (
        <SearchItem key={item._id} item={item} agentId={agentId} taskId={taskId} />
      ))}
      </div>
    </div>
  )
}

export default Index