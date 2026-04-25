import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setToken, setAuthUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const redirectByRole = (role) => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "pengurus") return "/pengurus/dashboard";
    return "/user/dashboard";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setAuthUser(data.user);

      navigate(redirectByRole(data.user.role));
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Masuk">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Masukkan email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Masukkan password"
          value={formData.password}
          onChange={handleChange}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Login"}
        </Button>

        <p className="text-sm text-center text-slate-600">
          Belum punya akun?{" "}
          <Link to="/register" className="text-slate-900 font-medium">
            Daftar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
