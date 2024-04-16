import Link from "next/link";
import {
  ChevronRightIcon,

} from "@heroicons/react/24/outline";

const BreadCrumb = ({category}: any) => {
  return (
    <div className="flex text-sm text-gray-600 items-center mx-2 my-4">
      <Link className="hover:underline" href="/">
        Home
      </Link>
      <ChevronRightIcon className="h-3 mx-1"/>
      <Link
        className="hover:underline"
        href={`/category/${category}`}
      >
        {category}
      </Link>
      <ChevronRightIcon className="h-3 mx-1"/>
    </div>
  );
}

export default BreadCrumb;