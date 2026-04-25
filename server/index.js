const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

connectDB();

const app = express();

/*
MIDDLEWARE
*/
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

/*
TEST ROUTE
*/
app.get("/", (req, res) => {
  res.json({
    message: "API hotel reservation running",
  });
});

/*
API ROUTES
*/
app.use("/api/auth", authRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/reservations", reservationRoutes);

app.use("/api/tickets", ticketRoutes);

app.use("/api/admin", adminRoutes);

/*
==================================
SOCKET.IO SETUP
==================================
*/

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  /*
  JOIN TICKET ROOM
  */
  socket.on("join_ticket", (ticketId) => {
    socket.join(ticketId);

    console.log(`${socket.id} joined room ${ticketId}`);
  });

  /*
  SEND CHAT MESSAGE
  */
  socket.on("send_message", (data) => {
    console.log("Incoming message:", data);

    io.to(data.ticketId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
