import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import Rooms from "./pages/user/Rooms";
import Reservation from "./pages/user/Reservation";
import Profile from "./pages/user/Profile";
import RoomDetail from "./pages/user/RoomDetail";
import UserTicket from "./pages/user/Ticket";
import UserTicketChat from "./pages/user/TicketChat";
import MyReservations from "./pages/user/MyReservations";
import Receipt from "./pages/user/Receipt";

import UserDashboard from "./pages/user/Dashboard";
import PengurusDashboard from "./pages/pengurus/Dashboard";
import PengurusReservations from "./pages/pengurus/Reservations";
import Ticket from "./pages/pengurus/Ticket";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminReservations from "./pages/admin/Reservation";
import Reports from "./pages/admin/Reports";
import RoomsManagement from "./pages/admin/RoomsManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import ChatLogs from "./pages/admin/ChatLogs";
import TicketChat from "./pages/pengurus/TicketChat";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRedirect from "./routes/RoleRedirect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/booking" element={<PengurusDashboard />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/redirect" element={<RoleRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/rooms"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Rooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/rooms/:roomType"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <RoomDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/reservation"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Reservation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/my-reservations"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyReservations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/receipt/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Receipt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/tickets"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserTicket />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/tickets/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserTicketChat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pengurus/dashboard"
          element={
            <ProtectedRoute allowedRoles={["pengurus"]}>
              <PengurusDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengurus/reservations"
          element={
            <ProtectedRoute allowedRoles={["pengurus"]}>
              <PengurusReservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengurus/tickets"
          element={
            <ProtectedRoute allowedRoles={["pengurus"]}>
              <Ticket />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pengurus/tickets/:id"
          element={
            <ProtectedRoute allowedRoles={["pengurus"]}>
              <TicketChat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UsersManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <RoomsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reservations"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminReservations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/chat"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ChatLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/chatlogs"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ChatLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/chat-logs"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ChatLogs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
