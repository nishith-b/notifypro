// NavBar.jsx
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-10 w-full border-b bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between max-w-5xl px-4 py-3 mx-auto">
        <Link to="/" className="text-lg font-bold text-indigo-700">
          NotifyPro
        </Link>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-2xl hover:bg-gray-100"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-2xl hover:bg-gray-100"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-gray-600 sm:inline">
                  Hello, {user?.name ? user.name.split(" ")[0] : "User"}!
                </span>
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
