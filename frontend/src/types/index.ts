export interface AdditionalDetails {
  gender?: string;
  dateOfBirth?: string;
  about?: string;
  contactNumber?: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountType: 'Customer' | 'Admin';
  image?: string;
  additionalDetails?: AdditionalDetails;
  cart?: string[];
  wishlist?: string[];
  token?: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  image?: string;
  products?: Product[];
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  image?: string;
  category?: string | Category;
  averageRating?: number;
  rating?: number;
  ratingAndReviews?: any[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string | User;
  orderItems: OrderItem[];
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  totalAmount: number;
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  orderStatus: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  paymentDetails?: {
    transactionId?: string;
    paymentMethod?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  products?: Product[];
  product?: Product;
  categories?: Category[];
  user?: User;
  token?: string;
  orders?: Order[];
  order?: Order;
}

export type ThemeMode = 'light' | 'dark' | 'system';
