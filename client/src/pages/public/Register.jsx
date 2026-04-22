import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { registerUser } from "../../services/AuthService";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { setToken, setAuthUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const data = await registerUser(formData);

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setAuthUser(data.user);

      navigate("/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Daftar Akun">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nama"
          name="name"
          placeholder="Masukkan nama"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Masukkan email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Nomor HP"
          name="phone"
          placeholder="Masukkan nomor HP"
          value={formData.phone}
          onChange={handleChange}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Masukkan password"
          value={formData.password}
          onChange={handleChange}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Daftar"}
        </Button>

        <p className="text-sm text-center text-slate-600">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-slate-900 font-medium">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
