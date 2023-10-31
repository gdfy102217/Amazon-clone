// 'use client';
import React, { useState, useEffect } from 'react'
import prismadb from '@/libs/prismadb';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux";
import { StateProps, StoreProduct, ProductProps } from "../../../type";
import Products from '@/components/Products';
import FormattedPrice from "@/components/FormattedPrice";
import CustomSearchPanel from "@/components/customSearchPanel"



const index = () => {
    const router = useRouter();
    const path = router.pathname;
    const { query } = router;
    const { productData, favoriteData, userInfo, allProducts } = useSelector(
      (state: StateProps) => state.next
    );
    const [allData, setAllData] = useState(allProducts.allProducts);
    const [searchQuery, setSearchQuery] = useState(query.search? query.search as string : "");

    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
      setAllData(allProducts.allProducts);
    }, [allProducts]);
    useEffect(() => {
      if (query.search){
        setSearchQuery(query.search as string);
        const filtered = allData.filter((item: StoreProduct) =>
          item.title.toLocaleLowerCase().includes((query.search as string).toLowerCase())
        );
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
          <Link href={`/product/${item._id}`} className="flex items-center gap-4 border hover:bg-gray-300">
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

export default index