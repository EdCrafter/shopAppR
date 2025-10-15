import React, { useState } from "react";
import { login } from "../../app/api";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setCurrentUser: React.Dispatch<React.SetStateAction<{ email: string; role: string } | null>>;
}

const Login: React.FC<LoginProps> = ({ setCurrentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // сброс ошибки
    try {
      const data = await login(email, password);
      if (data.success) {
        setCurrentUser({ email: data.user.email, role: data.user.role });
        navigate("/");
      } else {
        setError(data.errors?.[0] || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };



  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Sign In</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
