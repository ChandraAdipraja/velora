import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Ban,
  Filter,
  Search,
  ShieldCheck,
  SquarePen,
  Users2,
  X,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { userRecords } from "../../data/adminData";

const roleTone = {
  Guest: "neutral",
  Pengurus: "gold",
  Admin: "navy",
};

const statusTone = {
  Active: "success",
  Suspended: "danger",
  Pending: "warning",
};

const UsersManagement = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(userRecords[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;
  const activeUser = selectedUser ?? userRecords[0];

  const filteredUsers = useMemo(() => {
    return userRecords.filter((user) => {
      const matchesSearch = [user.name, user.email, user.id].some((value) =>
        value.toLowerCase().includes(search.toLowerCase()),
      );
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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
            title="Guest, manager, and admin access in one calm control surface."
            description="Search, filter, and manage profiles without a legacy enterprise look."
          />
        </motion.section>

        <motion.section variants={pageMotion} className="grid gap-6 ">
          <GlassCard className="min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                  User records
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  Guest and Pengurus directory
                </h3>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-soft bg-white/70 px-3 py-2 text-sm text-muted">
                <Filter className="h-4 w-4 text-champagne" />
                {filteredUsers.length} matches
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1.2fr_0.55fr_0.55fr]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search user, email, or ID"
                  className="w-full rounded-2xl border border-soft bg-white/80 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-champagne"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="rounded-2xl border border-soft bg-white/80 px-4 py-3 text-sm outline-none"
              >
                {["All", "Guest", "Pengurus", "Admin"].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-2xl border border-soft bg-white/80 px-4 py-3 text-sm outline-none"
              >
                {["All", "Active", "Suspended", "Pending"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 overflow-x-auto rounded-[28px] border border-soft bg-white/70">
              <table className="min-w-190 w-full text-left text-sm">
                <thead className="bg-white/80 text-xs uppercase tracking-[0.2em] text-muted">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Last seen</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-soft transition hover:bg-white/70"
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-navy">{user.name}</p>
                        <p className="mt-1 text-xs text-muted">
                          {user.email} · {user.id}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone={roleTone[user.role] || "neutral"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone={statusTone[user.status] || "neutral"}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-muted">{user.lastSeen}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="rounded-full border border-soft bg-white px-3 py-2 text-xs font-semibold text-navy hover:bg-white/90"
                          >
                            View
                          </button>
                          <button className="rounded-full border border-soft bg-white px-3 py-2 text-xs font-semibold text-navy hover:bg-white/90">
                            <SquarePen className="h-3.5 w-3.5" />
                          </button>
                          <button className="rounded-full border border-soft bg-white px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50">
                            <Ban className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 text-sm text-muted">
              <p>
                Page {currentPage} of {pageCount}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  className="rounded-full border border-soft bg-white px-4 py-2 font-semibold text-navy disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  disabled={currentPage === pageCount}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(pageCount, page + 1))
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
            ["Guest users", "128"],
            ["Pengurus", "34"],
            ["Suspended profiles", "06"],
          ].map(([label, value]) => (
            <GlassCard key={label} className="p-4" hover={false}>
              <p className="text-xs uppercase tracking-[0.24em] text-muted">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-navy">{value}</p>
            </GlassCard>
          ))}
        </motion.section>

        {selectedUser && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/20 p-4 backdrop-blur-sm">
            <div className="h-full max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-4xl border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
              <div className="flex items-start justify-between gap-4 border-b border-soft pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                    User profile modal
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-navy">
                    {selectedUser.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="rounded-full border border-soft bg-white p-2 text-navy"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 space-y-3 text-sm text-muted">
                <p>Email: {selectedUser.email}</p>
                <p>Role: {selectedUser.role}</p>
                <p>Status: {selectedUser.status}</p>
                <p>
                  Booking links, notes, and moderation actions can be attached
                  here.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white">
                  Edit profile
                </button>
                <button className="rounded-full border border-soft bg-white px-4 py-3 text-sm font-semibold text-navy">
                  Suspend access
                </button>
                <button className="rounded-full border border-soft bg-white px-4 py-3 text-sm font-semibold text-navy">
                  Reset password
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default UsersManagement;
