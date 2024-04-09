import { resetCart } from "@/store/nextSlice";
import { useDispatch } from "react-redux";

import useEventTracker, { EventMetaData }  from "@/pages/hooks/useEventTracker";
import { useAgentTask } from "@/contexts/agentTaskContext";


const ResetCart = () => {
  const dispatch = useDispatch();
  const { agentId, taskId } = useAgentTask();
  const { trackEvent } = useEventTracker();

  const handleResetCart = () => {
    // const confirmReset = window.confirm(
    //   "Are you sure to reset your items from the cart?"
    // );
    // if (confirmReset) {
    trackEvent({
        app: 'amazon',
        type: `task_${taskId}`,
        elementId: `reset_cart_btn`,
        msg: `click on reset cart btn`,
        agentId: agentId,
        taskId: taskId,
        urlPath: window.location.pathname,
        timestamp: Date.now(),
      } as  EventMetaData);
    dispatch(resetCart());
    // }
  };
  return (
    <button
      onClick={handleResetCart}
      className="w-44 h-10 font-semibold bg-gray-200 rounded-lg hover:bg-red-600 hover:text-white duration-300"
    >
      reset cart
    </button>
  );
};

export default ResetCart;
