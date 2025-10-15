import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./features/cart/Cart";
import Profile from "./features/auth/Profile";
import Login from "./features/auth/Login";
import Orders from "./features/orders/Orders";
import Register from "./features/auth/Register";
import Admin from "./pages/Admin";

function App() {
  const [currentUser, setCurrentUser] = useState<{email: string; role: string} | null>(null);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      <div className="container mt-4">
      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        
        {currentUser?.role === "admin" && (
          <Route path="/admin" element={<Admin />} />
        )}
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/signup" element={<Register />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
