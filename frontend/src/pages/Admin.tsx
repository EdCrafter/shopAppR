import React, { useEffect, useState } from "react";
import { 
  getUserProfile, getAllUsers, getAllProducts, 
  updateUser, updateProduct, register, createProduct, 
  deleteUser as apiDeleteUser, deleteProduct as apiDeleteProduct,
  restoreProduct as apiRestoreProduct
} from "../app/api";

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
  active: boolean;
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

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  const [newUser, setNewUser] = useState({
    first_name: "", last_name: "", email: "", password: "", password_confirmation: ""
  });

  const [newProduct, setNewProduct] = useState({
    name: "", description: "", price: ""
  });

  const fetchUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
      setOriginalUsers(allUsers.map((u:User) => ({ ...u })));
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch users.");
    }
  };

  const fetchProducts = async () => {
    try {
      const allProducts = await getAllProducts();
      setProducts(allProducts);
      setOriginalProducts(allProducts.map((p:Product) => ({ ...p })));
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch products.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserProfile();
        setProfile({ role: userProfile.role });

        if (userProfile.role === "admin") {
          await fetchUsers();
          await fetchProducts();
        }
      } catch (err) {
        console.error(err);
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

  const validateNewUser = () => {
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(newUser.first_name) || !nameRegex.test(newUser.last_name)) {
      setMessage("First and Last names must contain only letters.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      setMessage("Invalid email format.");
      return false;
    }
    if (newUser.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return false;
    }
    if (newUser.password !== newUser.password_confirmation) {
      setMessage("Passwords do not match.");
      return false;
    }
    return true;
  };

  const saveUser = async (user: User) => {
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

  const resetUser = (user: User) => {
    const original = originalUsers.find(u => u.id === user.id);
    if (original) {
      handleUserChange(user.id, "first_name", original.first_name);
      handleUserChange(user.id, "last_name", original.last_name);
      handleUserChange(user.id, "email", original.email);
    }
  };

  const handleAddUser = async () => {
    if (!validateNewUser()) return;
    setSaving(true);
    try {
      await register({
        email: newUser.email,
        password: newUser.password,
        password_confirmation: newUser.password_confirmation,
        first_name: newUser.first_name,
        last_name: newUser.last_name
      });
      setMessage("User added successfully! Click Refresh to see the new user.");
      setNewUser({ first_name: "", last_name: "", email: "", password: "", password_confirmation: "" });
      setShowAddUserForm(false);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add user.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteUser = async (id: number) => {
    setSaving(true);
    try {
      await apiDeleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      setOriginalUsers(prev => prev.filter(u => u.id !== id));
      setMessage("User deleted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete user.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleProductChange = (id: number, field: keyof Product, value: string | number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
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

  const resetProduct = (product: Product) => {
    const original = originalProducts.find(p => p.id === product.id);
    if (original) {
      handleProductChange(product.id, "name", original.name);
      handleProductChange(product.id, "description", original.description);
      handleProductChange(product.id, "price", original.price);
    }
  };

  const handleAddProduct = async () => {
    const priceNumber = parseFloat(newProduct.price as string);
    if (!newProduct.name || !newProduct.description || isNaN(priceNumber) || priceNumber <= 0) {
      setMessage("Please fill all product fields correctly.");
      return;
    }
    setSaving(true);
    try {
      await createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: priceNumber
      });
      setMessage("Product added successfully! Click Refresh to see the new product.");
      setNewProduct({ name: "", description: "", price: "" });
      setShowAddProductForm(false);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add product.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setSaving(true);
    try {
      await apiDeleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setOriginalProducts(prev => prev.filter(p => p.id !== id));
      setMessage("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete product.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleRestoreProduct = async (id: number) => {
    setSaving(true);
    try {
      await apiRestoreProduct(id);
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, active: true } : p))
      );
      setOriginalProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, active: true } : p))
      );
      setMessage("Product restored successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to restore product.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
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
        <>
          <div>
            <button className="btn btn-info me-2" onClick={fetchUsers}>Refresh Users</button>
            <button className="btn btn-success" onClick={() => setShowAddUserForm(prev => !prev)}>
              {showAddUserForm ? "Hide Add User Form" : "Add User"}
            </button>
          </div>

          {showAddUserForm && (
            <div className="card mt-2 p-3">
              <input className="form-control mb-2" placeholder="First Name" value={newUser.first_name} onChange={e => setNewUser({...newUser, first_name: e.target.value})} />
              <input className="form-control mb-2" placeholder="Last Name" value={newUser.last_name} onChange={e => setNewUser({...newUser, last_name: e.target.value})} />
              <input className="form-control mb-2" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
              <input className="form-control mb-2" type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
              <input className="form-control mb-2" type="password" placeholder="Confirm Password" value={newUser.password_confirmation} onChange={e => setNewUser({...newUser, password_confirmation: e.target.value})} />
              <button className="btn btn-primary me-2" onClick={handleAddUser} disabled={saving}>Add User</button>
            </div>
          )}

          <table className="table table-bordered mt-2">
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
                    <button className="btn btn-warning me-2" onClick={() => resetUser(user)} disabled={saving}>Reset</button>
                    <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)} disabled={saving}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === "products" && (
        <>
          <div>
            <button className="btn btn-info me-2" onClick={fetchProducts}>Refresh Products</button>
            <button className="btn btn-success" onClick={() => setShowAddProductForm(prev => !prev)}>
              {showAddProductForm ? "Hide Add Product Form" : "Add Product"}
            </button>
          </div>

          {showAddProductForm && (
            <div className="card mt-2 p-3">
              <input className="form-control mb-2" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name:e.target.value})} />
              <textarea className="form-control mb-2" style={{height:50}} placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description:e.target.value})} />
              <input className="form-control mb-2" type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price:e.target.value})} />
              <button className="btn btn-primary me-2" onClick={handleAddProduct} disabled={saving}>Add Product</button>
            </div>
          )}

          <table className="table table-bordered mt-2">
            <thead>
              <tr>
                <th>Name</th><th>Description</th><th>Price</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td><input type="text" className="form-control" value={product.name} onChange={e => handleProductChange(product.id, "name", e.target.value)} /></td>
                  <td><textarea className="form-control" style={{height:50}} value={product.description} onChange={e => handleProductChange(product.id, "description", e.target.value)} /></td>
                  <td><input type="number" className="form-control" value={product.price} onChange={e => handleProductChange(product.id, "price", parseFloat(e.target.value))} /></td>
                  <td>
                  {product.active === false ? (
                    <button 
                      className="btn btn-success" 
                      onClick={() => handleRestoreProduct(product.id)} 
                      disabled={saving}
                    >
                      Restore
                    </button>
                  ) : (
                    <>
                      <button 
                        className="btn btn-primary me-2" 
                        onClick={() => saveProduct(product)} 
                        disabled={saving}
                      >
                        Save
                      </button>
                      <button 
                        className="btn btn-warning me-2" 
                        onClick={() => resetProduct(product)} 
                        disabled={saving}
                      >
                        Reset
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDeleteProduct(product.id)} 
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>

                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Admin;