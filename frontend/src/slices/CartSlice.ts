import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types";

export interface CartState {
  cart: Product[];
  total: number;
  totalItems: number;
  loading: boolean;
}

const hasUser = !!localStorage.getItem("user") || !!localStorage.getItem("token");

const getStored = <T>(key: string, fallback: T): T => {
  if (!hasUser) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
    return fallback;
  }
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
};

const calculateTotal = (cart: Product[]): number => {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((sum, item) => sum + (Number(item?.price) || 0), 0);
};

const syncStorage = (cart: Product[], total: number, totalItems: number) => {
  try {
    const hasActiveUser = !!localStorage.getItem("user") || !!localStorage.getItem("token");
    if (!hasActiveUser) {
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
      return;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("total", JSON.stringify(total));
    localStorage.setItem("totalItems", JSON.stringify(totalItems));
  } catch (e) {}
};

const initialCart = getStored<Product[]>("cart", []);
const initialState: CartState = {
  cart: initialCart,
  total: getStored<number>("total", calculateTotal(initialCart)),
  totalItems: getStored<number>("totalItems", initialCart.length),
  loading: false,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Product[]>) => {
      const items = Array.isArray(action.payload) ? action.payload : [];
      state.cart = items;
      state.totalItems = items.length;
      state.total = calculateTotal(items);
      syncStorage(state.cart, state.total, state.totalItems);
    },
    addToCartLocal: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      if (!product || !product._id) return;

      const index = state.cart.findIndex((item) => item._id === product._id);
      if (index >= 0) {
        return;
      }

      state.cart.push(product);
      state.totalItems = state.cart.length;
      state.total = calculateTotal(state.cart);
      syncStorage(state.cart, state.total, state.totalItems);
    },
    removeFromCartLocal: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cart = state.cart.filter((item) => item._id !== productId);
      state.totalItems = state.cart.length;
      state.total = calculateTotal(state.cart);
      syncStorage(state.cart, state.total, state.totalItems);
    },
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      if (!product || !product._id) return;

      const index = state.cart.findIndex((item) => item._id === product._id);
      if (index >= 0) {
        return;
      }

      state.cart.push(product);
      state.totalItems = state.cart.length;
      state.total = calculateTotal(state.cart);
      syncStorage(state.cart, state.total, state.totalItems);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.cart = state.cart.filter((item) => item._id !== productId);
      state.totalItems = state.cart.length;
      state.total = calculateTotal(state.cart);
      syncStorage(state.cart, state.total, state.totalItems);
    },
    setCartLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;
      state.loading = false;
      try {
        localStorage.removeItem("cart");
        localStorage.removeItem("total");
        localStorage.removeItem("totalItems");
      } catch (e) {}
    },
  },
});

export const {
  setCart,
  addToCartLocal,
  removeFromCartLocal,
  addToCart,
  removeFromCart,
  setCartLoading,
  resetCart,
} = CartSlice.actions;

export default CartSlice.reducer;
