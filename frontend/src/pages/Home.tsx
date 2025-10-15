// src/pages/Home.tsx
import React from "react";
import ItemsList from "../features/items/ItemsList";

interface HomeProps {
  currentUser: { email: string; role: string } | null;
}

const Home: React.FC<HomeProps> = ({ currentUser }) => {
  if (!currentUser) {
    return (
      <div className="text-center mt-5">
        <h2>Welcome to Shop App!</h2>
        <h3 className="mb-4">Your are not logged in.</h3>
        <p className="lead">
          Please <a href="/login">sign in</a> or <a href="/signup">register</a> to view products.
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Product List</h2>
      <ItemsList />
    </div>
  );
};

export default Home;
