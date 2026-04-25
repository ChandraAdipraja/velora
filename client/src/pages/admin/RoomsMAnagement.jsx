import { useEffect, useMemo, useState } from "react";
import { Eye, Plus, Search, SquarePen, Trash2, X } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { motion } from "framer-motion";
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../../services/roomService";

const statusTone = {
  available: "success",
  maintenance: "warning",
  inactive: "danger",
};

const initialForm = {
  roomNumber: "",
  roomType: "Deluxe",
  pricePerHour: "",
  capacity: "",
  size: "",
  facilities: "",
  image: "",
  status: "available",
};

const formatCurrency = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const RoomsManagement = () => {
  const { token } = useAuth();

  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalMode, setModalMode] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  const fetchRooms = async () => {
    const res = await getAllRooms();
    setRooms(res.data.rooms || []);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch = [room.roomNumber, room.roomType]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase()),
        );

      const matchesType = typeFilter === "All" || room.roomType === typeFilter;

      const matchesStatus =
        statusFilter === "All" || room.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rooms, search, typeFilter, statusFilter]);

  const openCreate = () => {
    setModalMode("create");
    setSelectedRoom(null);
    setForm(initialForm);
    setMessage("");
  };

  const openView = (room) => {
    setModalMode("view");
    setSelectedRoom(room);
    setForm({
      roomNumber: room.roomNumber || "",
      roomType: room.roomType || "Deluxe",
      pricePerHour: room.pricePerHour || "",
      capacity: room.capacity || "",
      size: room.size || "",
      facilities: Array.isArray(room.facilities)
        ? room.facilities.join(", ")
        : room.facilities || "",
      image: room.image || "",
      status: room.status || "available",
    });
    setMessage("");
  };

  const openEdit = (room) => {
    openView(room);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedRoom(null);
    setForm(initialForm);
    setMessage("");
  };

  const buildPayload = () => ({
    ...form,
    pricePerHour: Number(form.pricePerHour),
    capacity: Number(form.capacity || 0),
    facilities:
      typeof form.facilities === "string"
        ? form.facilities
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
  });

  const submitRoom = async (e) => {
    e.preventDefault();

    try {
      const payload = buildPayload();

      if (modalMode === "create") {
        await createRoom(payload, token);
      }

      if (modalMode === "edit" && selectedRoom) {
        await updateRoom(selectedRoom._id, payload, token);
      }

      await fetchRooms();
      closeModal();
    } catch (error) {
      setMessage(error.response?.data?.message || "Gagal menyimpan data kamar");
    }
  };

  const removeRoom = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kamar ini?")) return;

    try {
      await deleteRoom(id, token);
      await fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menghapus kamar");
    }
  };

  const availableCount = rooms.filter(
    (room) => room.status === "available",
  ).length;
  const maintenanceCount = rooms.filter(
    (room) => room.status === "maintenance",
  ).length;
  const inactiveCount = rooms.filter(
    (room) => room.status === "inactive",
  ).length;
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
            label="Rooms Management"
            title="Manage hotel inventory"
            description="Create, view, edit, and maintain room units used by the reservation engine."
          />
        </motion.section>

        <motion.section variants={pageMotion}>
          <GlassCard className="min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-champagne">
                  Room records
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  Hotel room directory
                </h3>
              </div>

              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
                Create Room
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-[1.2fr_0.55fr_0.55fr]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-champagne" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search room number or type"
                  className="w-full rounded-2xl border border-soft bg-white py-3 pl-10 pr-4 outline-none"
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-2xl border border-soft bg-white px-4 py-3 outline-none"
              >
                {["All", "Deluxe", "Executive", "Presidential"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-soft bg-white px-4 py-3 outline-none"
              >
                {["All", "available", "maintenance", "inactive"].map(
                  (status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="mt-6 overflow-x-auto rounded-[28px] border border-soft bg-white/70">
              <table className="min-w-200 w-full text-left text-sm">
                <thead className="bg-white/80 text-xs uppercase tracking-[0.2em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Capacity</th>
                    <th className="px-4 py-3">Price/hour</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRooms.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-muted">
                        No rooms found.
                      </td>
                    </tr>
                  ) : (
                    filteredRooms.map((room) => (
                      <tr
                        key={room._id}
                        className="border-t border-soft transition hover:bg-white/70"
                      >
                        <td className="px-4 py-4">
                          <p className="font-semibold text-navy">
                            Room #{room.roomNumber}
                          </p>
                          <p className="mt-1 text-xs text-muted">
                            {room.size || "No size info"}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-muted">
                          {room.roomType}
                        </td>

                        <td className="px-4 py-4 text-muted">
                          {room.capacity || "-"} guests
                        </td>

                        <td className="px-4 py-4 font-semibold text-navy">
                          {formatCurrency(room.pricePerHour)}
                        </td>

                        <td className="px-4 py-4">
                          <Badge tone={statusTone[room.status] || "neutral"}>
                            {room.status}
                          </Badge>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openView(room)}
                              title="View"
                              className="rounded-full border border-soft bg-white p-2 text-navy hover:bg-white/90"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => openEdit(room)}
                              title="Edit"
                              className="rounded-full border border-soft bg-white p-2 text-navy hover:bg-white/90"
                            >
                              <SquarePen className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => removeRoom(room._id)}
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
          </GlassCard>
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 md:grid-cols-4"
        >
          {[
            ["Total rooms", rooms.length],
            ["Available", availableCount],
            ["Maintenance", maintenanceCount],
            ["Inactive", inactiveCount],
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
              onSubmit={submitRoom}
              className="h-full max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-4xl border border-white/70 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.18)]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-soft pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                    {modalMode === "create"
                      ? "Create room"
                      : modalMode === "view"
                        ? "View room"
                        : "Edit room"}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-navy">
                    {modalMode === "create"
                      ? "New room unit"
                      : `Room #${selectedRoom?.roomNumber}`}
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

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Room Number
                  </span>
                  <input
                    value={form.roomNumber}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        roomNumber: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none disabled:bg-slate-50"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Room Type
                  </span>
                  <select
                    value={form.roomType}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, roomType: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none disabled:bg-slate-50"
                  >
                    <option value="Deluxe">Deluxe</option>
                    <option value="Executive">Executive</option>
                    <option value="Presidential">Presidential</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Price per Hour
                  </span>
                  <input
                    type="number"
                    value={form.pricePerHour}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        pricePerHour: e.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none disabled:bg-slate-50"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Capacity
                  </span>
                  <input
                    type="number"
                    value={form.capacity}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, capacity: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none disabled:bg-slate-50"
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Size
                  </span>
                  <input
                    value={form.size}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, size: e.target.value }))
                    }
                    placeholder="Example: 32 m²"
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none disabled:bg-slate-50"
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Status
                  </span>
                  <select
                    value={form.status}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none disabled:bg-slate-50"
                  >
                    <option value="available">available</option>
                    <option value="maintenance">maintenance</option>
                    <option value="inactive">inactive</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Facilities
                  </span>
                  <input
                    value={form.facilities}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        facilities: e.target.value,
                      }))
                    }
                    placeholder="WiFi, AC, TV, Bathroom"
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none disabled:bg-slate-50"
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">
                    Image URL
                  </span>
                  <input
                    value={form.image}
                    disabled={isViewMode}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, image: e.target.value }))
                    }
                    placeholder="https://..."
                    className="mt-2 w-full rounded-2xl border border-soft px-4 py-3 outline-none disabled:bg-slate-50"
                  />
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
                    className="rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white"
                  >
                    {modalMode === "create" ? "Create room" : "Save changes"}
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

export default RoomsManagement;
