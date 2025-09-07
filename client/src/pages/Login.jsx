import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Card from "../components/common/Card";
import TextInput from "../components/common/TextInput";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("Both email and password are required.");
    }

    try {
      setLoading(true);

      // ✅ Call backend API
      const res = await axios.post(
        `${apiUrl}/api/user/login`,
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );

      console.log(res);

      // ✅ Save user in AuthContext
      login(res.data.user);

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
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
            <Button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
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
