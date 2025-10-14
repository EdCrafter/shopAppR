import axios from "axios";

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
  const response = await api.post("/users", { user: data });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post("/users/sign_in", {
    user: { email, password },
  });
  return response.data;
};

export const logout = async () => {
  const response = await api.delete("/users/sign_out");
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get("/api/v1/current_user");
  return response.data;
};

export const getItems = async () => {
  const response = await api.get("/items");
  return response.data;
};

export const searchItems = async (query: string) => {
  const response = await api.get(`/items/search?query=${encodeURIComponent(query)}`);
  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCart = async (itemId: number, quantity = 1) => {
  const response = await api.post("/cart_items", {
    item_id: itemId,
    quantity,
  });
  return response.data;
};

export const removeFromCart = async (cartItemId: number) => {
  const response = await api.delete(`/cart_items/${cartItemId}`);
  return response.data;
};

export const checkout = async () => {
  const response = await api.post("/cart/checkout");
  return response.data;
};

export default api;
