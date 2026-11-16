import { createSlice } from "@reduxjs/toolkit";

const hasUser = !!localStorage.getItem("user") || !!localStorage.getItem("token");

const getStored = (key, fallback) => {
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

const calculateTotal = (cart) => {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((sum, item) => sum + (Number(item?.price) || 0), 0);
};

const syncStorage = (cart, total, totalItems) => {
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

const initialCart = getStored("cart", []);
const initialState = {
  cart: initialCart,
  total: getStored("total", calculateTotal(initialCart)),
  totalItems: getStored("totalItems", initialCart.length),
  loading: false,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      const items = Array.isArray(action.payload) ? action.payload : [];
      state.cart = items;
      state.totalItems = items.length;
      state.total = calculateTotal(items);
      syncStorage(state.cart, state.total, state.totalItems);
    },
    addToCartLocal: (state, action) => {
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
    removeFromCartLocal: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter((item) => item._id !== productId);
      state.totalItems = state.cart.length;
      state.total = calculateTotal(state.cart);
      syncStorage(state.cart, state.total, state.totalItems);
    },
    addToCart: (state, action) => {
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
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter((item) => item._id !== productId);
      state.totalItems = state.cart.length;
      state.total = calculateTotal(state.cart);
      syncStorage(state.cart, state.total, state.totalItems);
    },
    setCartLoading: (state, action) => {
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
