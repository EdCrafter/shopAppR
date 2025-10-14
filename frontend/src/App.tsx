import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
// import CartPage from "./components/CartPage";
// import ProfilePage from "./components/ProfilePage";
// import AdminPage from "./components/AdminPage";

function App() {
  const [currentUser, setCurrentUser] = useState<{ role: string } | null>(null);

  const handleLogout = () => {
    // например, удаляем пользователя из состояния
    setCurrentUser(null);
    // здесь можно вызвать API для выхода
  };

  return (
    <BrowserRouter>
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      <div className="container mt-4">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
