import axios from "axios";
import type { Item } from "../features/items/ItemsSlice";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export const register = async (data: {
  email: string;
  password: string;
  password_confirmation: string;
  firstName?: string;
  lastName?: string;
}) => {
  try {
    const response = await api.post("/api/v1/users", {
      user: {
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
        first_name: data.firstName,
        last_name: data.lastName,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};


export const login = async (email: string, password: string) => {
  const response = await api.post("/api/v1/sign_in", {
    user: { email, password },
  });
  return response.data;
};

export const logout = async () => {
  const response = await api.delete("/api/v1/sign_out");
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get("/api/v1/current_user");
  return response.data;
};

export const getItems = async () => {
  const response = await api.get("/api/v1/items");
  return response.data;
};

export const searchItems = async (query: string) => {
  const response = await api.get(`/api/v1/items/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const checkout = async (cartItems: { item: Item; quantity: number }[]) => {
  const response = await api.post("/api/v1/checkout", {
    items: cartItems.map(ci => ({
      item_id: ci.item.id,
      quantity: ci.quantity,
    })),
  });
  return response.data;
};

export const removeFromCart = async (cartItemId: number) => {
  const response = await api.delete(`/cart_items/${cartItemId}`);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await api.get("/api/v1/orders");
  return response.data; 
};

export const getUserProfile = async () => {
  const response = await api.get("/api/v1/users/me");
  return response.data;
};

export const updateUserProfile = async (data: any) => {
  const response = await api.put("/api/v1/users/me", data);
  return response.data;
};


export default api;
