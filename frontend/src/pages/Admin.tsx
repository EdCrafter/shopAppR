import React, { useEffect, useState } from "react";
import { getUserProfile, getAllUsers, getAllProducts, updateUser, updateProduct } from "../app/api";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

const Admin: React.FC = () => {
  const [profile, setProfile] = useState<{ role: string }>({ role: "" });
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "products">("users");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserProfile();
        setProfile({ role: userProfile.role });

        if (userProfile.role === "admin") {
          const allUsers = await getAllUsers();
          setUsers(allUsers);

          const allProducts = await getAllProducts();
          setProducts(allProducts);
        }
      } catch (error) {
        console.error(error);
        setMessage("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUserChange = (id: number, field: keyof User, value: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const handleProductChange = (id: number, field: keyof Product, value: string | number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const validateUser = (user: User) => {
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(user.firstName) || !nameRegex.test(user.lastName)) {
      setMessage("First and Last names must contain only letters.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setMessage("Invalid email format.");
      return false;
    }
    return true;
  };

  const validateProduct = (product: Product) => {
    if (!product.name.trim()) {
      setMessage("Product name cannot be empty.");
      return false;
    }
    if (!product.description.trim()) {
      setMessage("Product description cannot be empty.");
      return false;
    }
    if (isNaN(product.price) || product.price <= 0) {
      setMessage("Product price must be a positive number.");
      return false;
    }
    return true;
  };

  const saveUser = async (user: User) => {
    if (!validateUser(user)) return;
    setSaving(true);
    try {
      await updateUser(user.id, user);
      setMessage(`User ${user.email} updated successfully!`);
    } catch (err) {
      console.error(err);
      setMessage(`Failed to update user ${user.email}.`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const saveProduct = async (product: Product) => {
    if (!validateProduct(product)) return;
    setSaving(true);
    try {
      await updateProduct(product.id, product);
      setMessage(`Product ${product.name} updated successfully!`);
    } catch (err) {
      console.error(err);
      setMessage(`Failed to update product ${product.name}.`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) return <p>Loading admin panel...</p>;
  if (profile.role !== "admin") return <p>You do not have access to this page.</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto" }}>
      <h2>Admin Panel</h2>

      {message && <div style={{ padding: "10px", backgroundColor: "#28a745", color: "white", borderRadius: 6, marginBottom: 10 }}>{message}</div>}

      <div style={{ marginBottom: "20px" }}>
        <button className={`btn ${activeTab === "users" ? "btn-primary" : "btn-secondary"} me-2`} onClick={() => setActiveTab("users")}>Users</button>
        <button className={`btn ${activeTab === "products" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("products")}>Products</button>
      </div>

      {activeTab === "users" && (
        <table className="table">
          <thead>
            <tr>
              <th>First Name</th><th>Last Name</th><th>Email</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td><input type="text" value={user.firstName} onChange={e => handleUserChange(user.id, "firstName", e.target.value)} /></td>
                <td><input type="text" value={user.lastName} onChange={e => handleUserChange(user.id, "lastName", e.target.value)} /></td>
                <td><input type="email" value={user.email} onChange={e => handleUserChange(user.id, "email", e.target.value)} /></td>
                <td><button className="btn btn-primary" onClick={() => saveUser(user)} disabled={saving}>Save</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "products" && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th><th>Description</th><th>Price</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td><input type="text" value={product.name} onChange={e => handleProductChange(product.id, "name", e.target.value)} /></td>
                <td><input type="text" value={product.description} onChange={e => handleProductChange(product.id, "description", e.target.value)} /></td>
                <td><input type="number" value={product.price} onChange={e => handleProductChange(product.id, "price", parseFloat(e.target.value))} /></td>
                <td><button className="btn btn-primary" onClick={() => saveProduct(product)} disabled={saving}>Save</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
