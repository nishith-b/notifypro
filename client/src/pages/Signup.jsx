import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { storage } from "../utils/storage";
import { emailRegex, phoneRegex } from "../utils/validators";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!emailRegex.test(form.email)) return setError("Invalid email");
    if (!phoneRegex.test(form.phone)) return setError("Invalid phone number");

    const users = storage.getUsers();
    if (users.find((u) => u.email === form.email)) {
      return setError("User already exists");
    }

    // Save new user into storage
    const updatedUsers = [...users, form];
    storage.saveUsers(updatedUsers);

    // ✅ Use AuthContext to login after signup
    signup(form);

    // Redirect to dashboard immediately
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <h1 className="mb-6 text-2xl font-bold text-center text-indigo-700">Create Account</h1>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />
          <button
            type="submit"
            className="w-full py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
