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
