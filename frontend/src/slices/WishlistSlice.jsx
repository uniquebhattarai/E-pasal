import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
  wishlistIds: [],
  loading: false,
};

const WishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      const items = action.payload || [];
      state.wishlist = items;
      state.wishlistIds = items.map((item) =>
        typeof item === "string" ? item : item._id
      );
    },
    toggleWishlistLocal: (state, action) => {
      const product = action.payload;
      const id = typeof product === "string" ? product : product._id;
      const index = state.wishlistIds.indexOf(id);

      if (index >= 0) {
        state.wishlistIds.splice(index, 1);
        state.wishlist = state.wishlist.filter(
          (item) => (typeof item === "string" ? item : item._id) !== id
        );
      } else {
        state.wishlistIds.push(id);
        if (typeof product === "object" && product !== null) {
          state.wishlist.push(product);
        }
      }
    },
    removeFromWishlistLocal: (state, action) => {
      const id = action.payload;
      state.wishlistIds = state.wishlistIds.filter((item) => item !== id);
      state.wishlist = state.wishlist.filter(
        (item) => (typeof item === "string" ? item : item._id) !== id
      );
    },
    setWishlistLoading: (state, action) => {
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

