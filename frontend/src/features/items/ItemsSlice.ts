import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface ItemsState {
  items: Item[];
  searchTerm: string;
  cartItems: { item: Item; quantity: number }[];
}

const initialState: ItemsState = {
  items: [],
  searchTerm: "",
  cartItems: [],
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Item[]>) {
      state.items = action.payload;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
    },
    addToCart(state, action: PayloadAction<{ item: Item; quantity: number }>) {
      const existing = state.cartItems.find(ci => ci.item.id === action.payload.item.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cartItems.push(action.payload);
      }
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.cartItems = state.cartItems.filter(ci => ci.item.id !== action.payload);
    },
  },
});

export const { setItems, setSearchTerm, addToCart, removeFromCart } = itemsSlice.actions;
export default itemsSlice.reducer;
