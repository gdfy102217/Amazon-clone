import Image from "next/image";
import logo from "../../images/logo.png";
import cartIcon from "../../images/cartIcon.png";
import { BiCaretDown } from "react-icons/bi";
import { HiOutlineSearch } from "react-icons/hi";
import { SlLocationPin } from "react-icons/sl";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { StateProps, StoreProduct } from "../../../type";
// import { useSession, signIn, signOut } from "next-auth/react";
import { SignedIn, UserButton, useSession } from "@clerk/clerk-react";

import { useEffect, useState } from "react";
import { addUser } from "@/store/nextSlice";
import SearchProducts from "../SearchProducts";
import SignInPage from "@/pages/sign-in";
import { useUser } from "@clerk/clerk-react";
import { useRouter } from 'next/router';


const Header = () => {
  const { session } = useSession();
  const [allData, setAllData] = useState([]);
  const { productData, favoriteData, userInfo, allProducts } = useSelector(
    (state: StateProps) => state.next
  );
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  
  const dispatch = useDispatch();
  useEffect(() => {
    setAllData(allProducts.allProducts);
  }, [allProducts]);
  useEffect(() => {
    if (session) {
      dispatch(
        addUser({
          name: session?.user?.username,
          email: session?.user?.primaryEmailAddress?.emailAddress,
          image: session?.user?.imageUrl
        })
      );
    }
  }, [session]);

  // Search area
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [blurTimeoutId, setBlurTimeoutId] = useState<number | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmitSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(`/browse?search=${searchQuery}`)
  };

  const handleBlur = () => {
    // Set a timeout for the onBlur event
    const timeoutId = setTimeout(() => {
      setIsSearchFocused(false);
    }, 200) as unknown as number;

    setBlurTimeoutId(timeoutId);
  };

  const handleSearchResultClick = () => {
    // Clear the onBlur timeout if a search result is clicked
    if (blurTimeoutId !== null) {
      clearTimeout(blurTimeoutId);
    }
    // Clear the search query
    setSearchQuery("");
  };



  useEffect(() => {
    const filtered = allData.filter((item: StoreProduct) =>
      item.title.toLocaleLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  return (
    <div className="w-full h-20 bg-amazon_blue text-lightText sticky top-0 z-50">
      <div className="h-full w-full mx-auto inline-flex items-center justify-between gap-1 mdl:gap-3 px-4">
        {/* logo */}
        <Link
          href={"/"}
          className="px-2 border border-transparent hover:border-white cursor-pointer duration-300 flex items-center justify-center h-[70%]"
        >
          <Image className="w-28 object-cover mt-1" src={logo} alt="logoImg" />
        </Link>
        {/* delivery */}
        <div className="px-2 border border-transparent hover:border-white cursor-pointer duration-300 items-center justify-center h-[70%] hidden xl:inline-flex gap-1">
          <SlLocationPin />
          <div className="text-xs">
            <p>Deliver to</p>
            <p className="text-white font-bold uppercase">USA</p>
          </div>
        </div>
        {/* serchbar */}
        <div className="flex-1 h-10 hidden md:inline-flex items-center justify-between relative">
          <input
            onChange={handleSearch}
            value={searchQuery}
            className="w-full h-full rounded-md px-2 placeholder:text-sm text-base text-black border-[3px] border-transparent outline-none focus-visible:border-amazon_yellow"
            type="text"
            placeholder="Search next_amazon_yt products"
            onFocus={() => setIsSearchFocused(true)}
            onBlur={handleBlur}
          />
          <button className="w-12 h-full bg-amazon_yellow text-black text-2xl flex items-center justify-center absolute right-0 rounded-tr-md rounded-br-md"
            onClick={handleSubmitSearch}
          >
            <span >
              <HiOutlineSearch />
            </span>
          </button>
          {/* ========== Searchfield ========== */}
          {searchQuery && isSearchFocused && (
            <div className="absolute left-0 top-12 w-full mx-auto max-h-96 bg-gray-200 rounded-lg overflow-y-scroll cursor-pointer text-black">
              {filteredProducts.length > 0 ? (
                <>
                  {searchQuery &&
                    filteredProducts.map((item: StoreProduct) => (
                      <Link
                        key={item._id}
                        className="w-full border-b-[1px] border-b-gray-400 flex items-center gap-4"
                        href={{
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
                          },
                        }}
                        onClick={handleSearchResultClick}
                      >
                        <SearchProducts item={item} />
                      </Link>
                    ))}
                </>
              ) : (
                <div className="bg-gray-50 flex items-center justify-center py-10 rounded-lg shadow-lg">
                  <p className="text-xl font-semibold animate-bounce">
                    Nothing is matches with your search keywords. Please try
                    again!
                  </p>
                </div>
              )}
            </div>
          )}
          {/* ========== Searchfield ========== */}
        </div>
        {/* signin */}
        {isSignedIn ? (
          <div className="flex items-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] gap-1">
            {/* <img
              src={userInfo.image}
              alt="userImage"
              className="w-8 h-8 rounded-full object-cover"
            /> */}
            <div className="w-8 h-8 rounded-full object-cover">
              <UserButton afterSignOutUrl="/"/>
            </div>
            <div className="text-xs text-gray-100 flex flex-col justify-between">
              <p className="text-white font-bold">{user.username}</p>
              <p>{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        ) : (
          <div
            // onClick={() => signIn()}
            // href={"/sign-in"}
            className="text-xs text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%]"
          >
            <Link href={"/sign-in"}>
            <p>Hello, sign in</p>
            <p className="text-white font-bold flex items-center">
              Account & Lists{" "}
              <span>
                <BiCaretDown />
              </span>
            </p>
            </Link>
          </div>
        )}
        {/* fovorite */}
        <Link
          href={"/favorite"}
          className="text-xs text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative"
        >
          <p>Marked</p>
          <p className="text-white font-bold">& Favorite</p>
          {favoriteData.length > 0 && (
            <span className="absolute right-2 top-2 w-4 h-4 border-[1px] border-gray-400 flex items-center justify-center text-xs text-amazon_yellow">
              {favoriteData.length}
            </span>
          )}
        </Link>
        <Link
          href={"/orders"}
          className="text-xs text-gray-100 flex flex-col justify-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative"
        >
          <p>Returns</p>
          <p className="text-white font-bold">& Orders</p>
          {/* {favoriteData.length > 0 && (
            <span className="absolute right-2 top-2 w-4 h-4 border-[1px] border-gray-400 flex items-center justify-center text-xs text-amazon_yellow">
              {favoriteData.length}
            </span>
          )} */}
        </Link>
        {/* cart */}
        <Link
          href={"/cart"}
          className="flex items-center px-2 border border-transparent hover:border-white cursor-pointer duration-300 h-[70%] relative"
        >
          <Image
            className="w-auto object-cover h-8"
            src={cartIcon}
            alt="cartImg"
          />
          <p className="text-xs text-white font-bold mt-3">Cart</p>
          <span className="absolute text-amazon_yellow text-sm top-2 left-[29px] font-semibold">
            {productData ? productData.length : 0}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Header;
