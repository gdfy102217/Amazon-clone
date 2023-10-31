import Banner from "@/components/Banner";
import Products from "@/components/Products";
import { ProductProps } from "../../type";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAllProducts } from "@/store/nextSlice";
import Head from "next/head";
import prismadb from "@/libs/prismadb";


interface Props {
  productData: ProductProps;
}

export default function Home({ productData }: Props) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAllProducts({ allProducts: productData }));
  }, [productData]);
  return (
    <>
      <Head>
        <title>Amazon</title>
        <meta name="description" content="Clone Amazon" />
        <link
          rel="icon"
          href="https://th.bing.com/th/id/OIP.XVG1A3K8KsIWzckT_E6NRAHaHa?pid=ImgDet&w=558&h=558&rs=1"
        />
      </Head>
    <main>
      <div className="max-w-screen-2xl mx-auto">
        <Banner />
        <div className="relative md:-mt020 lgl:-mt-32 xl:-mt-60 z-20 mb-10">
          <Products productData={productData} />
        </div>
      </div>
    </main>
    </>
  );
}

// SSR for data fetching
export const getServerSideProps = async () => {
  let productData = await prismadb.product.findMany();

  // let each data _id == productData._id
  productData.forEach((item: any) => {
    item._id = item.id.toString();
  });

  return { props: { productData } };
};
