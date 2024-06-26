import { SiMediamarkt } from "react-icons/si";
import FormattedPrice from "./FormattedPrice";
import { useDispatch, useSelector } from "react-redux";
import { StateProps, StoreProduct } from "../../type";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/clerk-react";
import { SignedIn, UserButton, useSession } from "@clerk/clerk-react";
import { resetCart } from "@/store/nextSlice";

import { useAgentTask } from "@/contexts/agentTaskContext";
import useEventTracker, { EventMetaData }  from "@/pages/hooks/useEventTracker";


const CartPayment = () => {
  const { agentId, taskId } = useAgentTask();
  const { trackEvent } = useEventTracker();

  const dispatch = useDispatch();
  const { productData, userInfo } = useSelector(
    (state: StateProps) => state.next
  );
  const [totalAmount, setTotalAmount] = useState(0);
  
  const { session } = useSession();
  const { user } = useUser();

  useEffect(() => {
    let amt = 0;
    productData.map((item: StoreProduct) => {
      amt += item.price * item.quantity;
      return;
    });
    setTotalAmount(amt);
  }, [productData]);
  // Striep payment
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  // const { data: session } = useSession();

  const handleCheckout = async () => {
    console.log("Triggering Stripe Checkout")
    
    trackEvent({
      app: 'amazon',
      type: `task_${taskId}`,
      elementId: `checkout_btn`,
      msg: `proceed to checkout`,
      agentId: agentId,
      taskId: taskId,
      urlPath: window.location.pathname,
      timestamp: Date.now(),
      payload: productData,
    } as  EventMetaData);

    const stripe = await stripePromise;
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        items: productData, 
        email: user?.primaryEmailAddress?.emailAddress,
        userId: user?.id,
      }),
    });
    const checkoutSession = await response.json();

    // Redirecting user/customer to Stripe Checkout
    dispatch(resetCart());
    const result: any = await stripe?.redirectToCheckout({
      sessionId: checkoutSession.id,
    });
    if (result.error) {
      alert(result?.error.message);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <span className="bg-green-600 rounded-full p-1 h-6 w-6 text-sm text-white flex items-center justify-center mt-1">
          <SiMediamarkt />
        </span>
        <p className="text-sm">
          Your order qualifies for FREE Shipping by Choosing this option at
          checkout. See details....
        </p>
      </div>
      <p className="flex items-center justify-between px-2 font-semibold">
        Total:{" "}
        <span className="font-bold text-xl">
          <FormattedPrice amount={totalAmount} />
        </span>
      </p>
      {userInfo ? (
        <div className="flex flex-col items-center">
          <button
            onClick={handleCheckout}
            className="w-full h-10 text-sm font-semibold bg-amazon_blue text-white rounded-lg hover:bg-amazon_yellow hover:text-black duration-300"
          >
            Proceed to Buy
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <button className="w-full h-10 text-sm font-semibold bg-amazon_blue bg-opacity-50 text-white rounded-lg cursor-not-allowed">
            Proceed to Buy
          </button>
          <p className="text-xs mt-1 text-red-500 font-semibold animate-bounce">
            Please login to continue
          </p>
        </div>
      )}
    </div>
  );
};

export default CartPayment;
