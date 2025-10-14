import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getItems = async () => {
  const response = await api.get("/items");
  return response.data;
};

export const addToCart = async (itemId: number, quantity = 1) => {
  const response = await api.post("/cart_items", {
    item_id: itemId,
    quantity,
  });
  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const removeFromCart = async (cartItemId: number) => {
  const response = await api.delete(`/cart_items/${cartItemId}`);
  return response.data;
};

export const checkout = async () => {
  const response = await api.post("/checkout");
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post("/users/sign_in", {
    user: { email, password },
  });
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await api.post("/users", {
    user: { email, password },
  });
  return response.data;
};

export default api;
