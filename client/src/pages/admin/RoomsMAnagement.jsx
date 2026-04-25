import { useState } from "react";
import { motion } from "framer-motion";
import {
  CircleCheckBig,
  Filter,
  Pencil,
  Plus,
  Trash2,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import {
  Badge,
  GlassCard,
  SectionHeader,
  pageMotion,
} from "../../components/velora/PlatformKit";
import { roomInventory } from "../../data/adminData";

const toneByStatus = {
  Available: "success",
  Occupied: "navy",
  Maintenance: "warning",
  "VIP hold": "gold",
};

const RoomsManagement = () => {
  const [roomType, setRoomType] = useState("All");

  const filteredRooms =
    roomType === "All"
      ? roomInventory
      : roomInventory.filter((room) => room.type === roomType);

  return (
    <AdminLayout>
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
        className="space-y-8"
      >
        <motion.section variants={pageMotion} className="grid gap-6 ">
          <GlassCard>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
                  Inventory
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-navy">
                  Room cards and pricing
                </h3>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white">
                <Plus className="h-4 w-4" />
                Add room
              </button>
            </div>
            <div className="mt-5 overflow-hidden rounded-[28px] border border-soft bg-white/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/80 text-xs uppercase tracking-[0.2em] text-muted">
                  <tr>
                    <th className="px-4 py-3">Room</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room) => (
                    <tr
                      key={room.id}
                      className="border-t border-soft transition hover:bg-white/70"
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-navy">{room.name}</p>
                        <p className="mt-1 text-xs text-muted">{room.id}</p>
                      </td>
                      <td className="px-4 py-4 text-muted">{room.type}</td>
                      <td className="px-4 py-4 font-semibold text-navy">
                        {room.price}
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone={toneByStatus[room.status] || "neutral"}>
                          {room.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="rounded-full border border-soft bg-white p-2 text-navy">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button className="rounded-full border border-soft bg-white p-2 text-navy">
                            <Wrench className="h-4 w-4" />
                          </button>
                          <button className="rounded-full border border-soft bg-white p-2 text-rose-700">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.section>

        <motion.section
          variants={pageMotion}
          className="grid gap-6 md:grid-cols-3"
        >
          {[
            ["Ready to sell", "34 rooms"],
            ["Maintenance queue", "07 rooms"],
            ["Occupancy alert", "12 holds"],
          ].map(([label, value]) => (
            <GlassCard key={label} className="p-4" hover={false}>
              <p className="text-xs uppercase tracking-[0.24em] text-muted">
                {label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-navy">{value}</p>
            </GlassCard>
          ))}
        </motion.section>
      </motion.div>
    </AdminLayout>
  );
};

export default RoomsManagement;
