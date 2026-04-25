import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Filter, Plus, Search, SquarePen, Trash2, X } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { useAuth } from "../../context/AuthContext";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/adminService";

const roleTone = {
  user: "neutral",
  pengurus: "gold",
  admin: "navy",
};

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "user",
};

const UsersManagement = () => {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers(token);
      setUsers(res.data.users || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const openCreateModal = () => {
    setSelectedUser(null);
    setForm(initialForm);
    setModalMode("create");
    setMessage("");
  };

  const openViewModal = (user) => {
    setSelectedUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "user",
    });
    setModalMode("view");
    setMessage("");
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "user",
    });
    setModalMode("edit");
    setMessage("");
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalMode(null);
    setForm(initialForm);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setProcessing(true);
      setMessage("");

      if (modalMode === "create") {
        await createUser(form, token);
      }

      if (modalMode === "edit" && selectedUser) {
        await updateUser(
          selectedUser._id,
          {
            name: form.name,
            email: form.email,
            role: form.role,
          },
          token,
        );
      }

      await fetchUsers();
      closeModal();
    } catch (error) {
      setMessage(error.response?.data?.message || "Aksi gagal diproses");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus user ini?");
    if (!confirmDelete) return;

    try {
      await deleteUser(id, token);
      await fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Gagal menghapus user");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = [user.name, user.email, user._id]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search.toLowerCase()));

      const matchesRole = roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const guestCount = users.filter((user) => user.role === "user").length;
  const pengurusCount = users.filter((user) => user.role === "pengurus").length;
  const adminCount = users.filter((user) => user.role === "admin").length;

  const isViewMode = modalMode === "view";

  return (
    <AdminLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion}>
          <SectionHeader
            label="User management"
            title="Guest, pengurus, and admin access control."
            description="Create, view, edit, and delete platform accounts."
          />
        </motion.section>

        <motion.section variants={pageMotion}>
          <GlassCard className="min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-champagne">
                  User records
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  Platform user directory
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-soft bg-white/70 px-3 py-2 text-sm">
                  <Filter className="h-4 w-4 text-champagne" />
                  {filteredUsers.length} matches
                </div>

                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white"
                >
                  <Plus className="h-4 w-4" />
                  Create User
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1.2fr_0.55fr]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search user"
                  className="w-full rounded-2xl border border-soft bg-white py-3 pl-10 pr-4 outline-none"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-2xl border border-soft bg-white px-4 py-3 outline-none"
              >
                {["All", "user", "pengurus", "admin"].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 overflow-x-auto rounded-[28px] border border-soft bg-white/70">
              <table className="min-w-180 w-full text-left text-sm">
                <thead className="bg-white/80 text-xs uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-8 text-muted">
                        Loading users...
                      </td>
                    </tr>
                  ) : visibleUsers.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-8 text-muted">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    visibleUsers.map((user) => (
                      <tr key={user._id} className="border-t border-soft">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-navy">{user.name}</p>
                          <p className="text-xs text-muted">
                            {user.email} · {user._id}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <Badge tone={roleTone[user.role] || "neutral"}>
                            {user.role}
                          </Badge>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openViewModal(user)}
                              title="View"
                              className="rounded-full border border-soft bg-white p-2 text-navy hover:bg-white/90"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditModal(user)}
                              title="Edit"
                              className="rounded-full border border-soft bg-white p-2 text-navy hover:bg-white/90"
                            >
                              <SquarePen className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(user._id)}
                              title="Delete"
                              className="rounded-full border border-soft bg-white p-2 text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center justify-between text-sm text-muted">
              <p>
                Page {currentPage} of {pageCount}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-full border border-soft bg-white px-4 py-2 font-semibold text-navy disabled:opacity-40"
                >
                  Prev
                </button>

                <button
                  disabled={currentPage === pageCount}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pageCount, p + 1))
                  }
                  className="rounded-full border border-soft bg-white px-4 py-2 font-semibold text-navy disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 md:grid-cols-3"
        >
          {[
            ["Guest users", guestCount],
            ["Pengurus", pengurusCount],
            ["Admin", adminCount],
          ].map(([label, value]) => (
            <GlassCard key={label} className="p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-navy">{value}</p>
            </GlassCard>
          ))}
        </motion.section>

        {modalMode && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/20 p-4 backdrop-blur-sm">
            <form
              onSubmit={handleSubmit}
              className="h-full max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-4xl border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-soft pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                    {modalMode === "create"
                      ? "Create user"
                      : modalMode === "view"
                        ? "View user"
                        : "Edit user"}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-navy">
                    {modalMode === "create"
                      ? "New platform account"
                      : selectedUser?.name}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-soft bg-white p-2 text-navy"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Name
                  </span>
                  <input
                    value={form.name}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none disabled:bg-slate-50"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Email
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none disabled:bg-slate-50"
                    required
                  />
                </label>

                {modalMode === "create" && (
                  <label className="block">
                    <span className="text-xs uppercase tracking-[0.22em] text-muted">
                      Password
                    </span>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none"
                      required
                    />
                  </label>
                )}

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Role
                  </span>
                  <select
                    value={form.role}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, role: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none disabled:bg-slate-50"
                  >
                    <option value="user">user</option>
                    <option value="pengurus">pengurus</option>
                    <option value="admin">admin</option>
                  </select>
                </label>

                {message && (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {message}
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {modalMode !== "view" && (
                  <button
                    type="submit"
                    disabled={processing}
                    className="rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {processing
                      ? "Saving..."
                      : modalMode === "create"
                        ? "Create user"
                        : "Save changes"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-soft bg-white px-4 py-3 text-sm font-semibold text-navy"
                >
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>
              </div>
            </form>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default UsersManagement;
