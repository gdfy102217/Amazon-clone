export interface ProductProps {
  brand: string;
  category: [];
  description: string;
  image: string;
  isNew: boolean;
  oldPrice: number;
  price: number;
  title: string;
  _id: number;
}
export interface StoreProduct {
  brand: string;
  category: [];
  description: string;
  image: string;
  isNew: boolean;
  oldPrice: number;
  price: number;
  title: string;
  _id: number;
  quantity: number;
}

export interface StateProps {
  productData: [];
  favoriteData: [];
  userInfo: null | string;
  next: any;
}

export interface OrderItemProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  productId: string;
  price: number;
  quantity: number;
  product: ProductProps; // This is the product related to the order item
}

export interface OrderProps {
  id: string;
  userId: string;
  total: number;
  address: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemProps[]; // This is the array of order items related to the order
}


export interface AgentTaskType {
  agentId: string;
  taskId: string;
}