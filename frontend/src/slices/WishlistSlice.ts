import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../types";

export interface WishlistState {
  wishlist: Product[];
  wishlistIds: string[];
  loading: boolean;
}

const initialState: WishlistState = {
  wishlist: [],
  wishlistIds: [],
  loading: false,
};

const WishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<Product[]>) => {
      const items = action.payload || [];
      state.wishlist = items;
      state.wishlistIds = items.map((item: any) =>
        typeof item === "string" ? item : item._id
      );
    },
    toggleWishlistLocal: (state, action: PayloadAction<Product | string>) => {
      const product = action.payload;
      const id = typeof product === "string" ? product : product._id;
      const index = state.wishlistIds.indexOf(id);

      if (index >= 0) {
        state.wishlistIds.splice(index, 1);
        state.wishlist = state.wishlist.filter(
          (item: any) => (typeof item === "string" ? item : item._id) !== id
        );
      } else {
        state.wishlistIds.push(id);
        if (typeof product === "object" && product !== null) {
          state.wishlist.push(product as Product);
        }
      }
    },
    removeFromWishlistLocal: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.wishlistIds = state.wishlistIds.filter((item) => item !== id);
      state.wishlist = state.wishlist.filter(
        (item: any) => (typeof item === "string" ? item : item._id) !== id
      );
    },
    setWishlistLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetWishlist: (state) => {
      state.wishlist = [];
      state.wishlistIds = [];
      state.loading = false;
    },
  },
});

export const {
  setWishlist,
  toggleWishlistLocal,
  removeFromWishlistLocal,
  setWishlistLoading,
  resetWishlist,
} = WishlistSlice.actions;

export default WishlistSlice.reducer;
