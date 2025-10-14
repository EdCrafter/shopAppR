// frontend/src/features/auth/Register.tsx
import { useState } from "react";
import { register } from "../../app/api";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await register({ email, password, password_confirmation: password, firstName, lastName });
    console.log(res);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
      <input placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
};
