import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/common/Card";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";
import { storage } from "../utils/storage";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    const users = storage.getUsers();
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === form.email.toLowerCase() &&
        u.password === form.password
    );

    if (!match) {
      return setError("Invalid email or password.");
    }

    // ✅ Delegate session handling to AuthContext
    login(match);
    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card title="Log in">
        <form className="space-y-4" onSubmit={onSubmit}>
          <TextInput
            label="Email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={onChange}
            required
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={onChange}
            required
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex items-center justify-between">
            <Button type="submit">Login</Button>
            <Link
              to="/signup"
              className="text-sm text-indigo-600 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </form>
      </Card>
    </main>
  );
}
