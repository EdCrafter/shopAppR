import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Item {
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
  },
});

export const { setItems, setSearchTerm } = itemsSlice.actions;
export default itemsSlice.reducer;
