// src/features/cart/CartSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Item } from "../items/ItemsSlice";

interface CartItem {
  item: Item;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<{ item: Item; quantity: number }>) {
      const existing = state.cartItems.find(
        (ci) => ci.item.id === action.payload.item.id
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cartItems.push({
          item: action.payload.item,
          quantity: action.payload.quantity,
        });
      }
    },

    removeFromCart(state, action: PayloadAction<number>) {
      state.cartItems = state.cartItems.filter(
        (ci) => ci.item.id !== action.payload
      );
    },

    updateQuantity(
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) {
      const item = state.cartItems.find(
        (ci) => ci.item.id === action.payload.id
      );
      if (item) {
        item.quantity = action.payload.quantity;
        state.cartItems = [...state.cartItems]; 
      }
    },
    clearCart(state) {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
