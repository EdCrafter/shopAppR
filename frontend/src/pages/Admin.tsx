import React, { useEffect, useState } from "react";
import { getUserProfile, getAllUsers, getAllProducts, updateUser, updateProduct } from "../app/api";

type User = {
  id: number;
  first_name: string;
  last_name: string;
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
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
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
          setOriginalUsers(allUsers.map((u: User) => ({ ...u })));

          const allProducts = await getAllProducts();
          setProducts(allProducts);
          setOriginalProducts(allProducts.map((p: Product) => ({ ...p })));
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
    if (!nameRegex.test(user.first_name) || !nameRegex.test(user.last_name)) {
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

  const resetUser = (user: User) => {
    const original = originalUsers.find(u => u.id === user.id);
    if (original) {
      handleUserChange(user.id, "first_name", original.first_name);
      handleUserChange(user.id, "last_name", original.last_name);
      handleUserChange(user.id, "email", original.email);
    }
  };

  const resetProduct = (product: Product) => {
    const original = originalProducts.find(p => p.id === product.id);
    if (original) {
      handleProductChange(product.id, "name", original.name);
      handleProductChange(product.id, "description", original.description);
      handleProductChange(product.id, "price", original.price);
    }
  };

  if (loading) return <p>Loading admin panel...</p>;
  if (profile.role !== "admin") return <p>You do not have access to this page.</p>;

  return (
    <div className="container mt-4">
      <h2>Admin Panel</h2>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="mb-3">
        <button className={`btn ${activeTab === "users" ? "btn-primary" : "btn-secondary"} me-2`} onClick={() => setActiveTab("users")}>Users</button>
        <button className={`btn ${activeTab === "products" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("products")}>Products</button>
      </div>

      {activeTab === "users" && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>First Name</th><th>Last Name</th><th>Email</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td><input type="text" className="form-control" value={user.first_name} onChange={e => handleUserChange(user.id, "first_name", e.target.value)} /></td>
                <td><input type="text" className="form-control" value={user.last_name} onChange={e => handleUserChange(user.id, "last_name", e.target.value)} /></td>
                <td><input type="email" className="form-control" value={user.email} onChange={e => handleUserChange(user.id, "email", e.target.value)} /></td>
                <td>
                  <button className="btn btn-primary me-2" onClick={() => saveUser(user)} disabled={saving}>Save</button>
                  <button className="btn btn-warning" onClick={() => resetUser(user)} disabled={saving}>Reset</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "products" && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th><th>Description</th><th>Price</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td><input type="text" className="form-control" value={product.name} onChange={e => handleProductChange(product.id, "name", e.target.value)} /></td>
                <td><textarea className="form-control" style={{ height: 50 }} value={product.description} onChange={e => handleProductChange(product.id, "description", e.target.value)} /></td>
                <td><input type="number" className="form-control" value={product.price} onChange={e => handleProductChange(product.id, "price", parseFloat(e.target.value))} /></td>
                <td>
                  <button className="btn btn-primary me-2" onClick={() => saveProduct(product)} disabled={saving}>Save</button>
                  <button className="btn btn-warning" onClick={() => resetProduct(product)} disabled={saving}>Reset</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
