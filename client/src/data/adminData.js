export const adminNavSummary = [
  { label: "Total bookings", value: "1,284", delta: "+12.4%" },
  { label: "Active guests", value: "248", delta: "+6.8%" },
  { label: "Available rooms", value: "34", delta: "12 holds" },
  { label: "Revenue", value: "Rp 4.8B", delta: "+18.2%" },
];

export const occupancyChart = [
  { name: "Mon", occupancy: 72, revenue: 3.1 },
  { name: "Tue", occupancy: 76, revenue: 3.4 },
  { name: "Wed", occupancy: 78, revenue: 3.7 },
  { name: "Thu", occupancy: 81, revenue: 4.0 },
  { name: "Fri", occupancy: 86, revenue: 4.5 },
  { name: "Sat", occupancy: 92, revenue: 5.1 },
  { name: "Sun", occupancy: 88, revenue: 4.7 },
];

export const roomStatusOverview = [
  { label: "Available", value: 34, tone: "success" },
  { label: "Occupied", value: 96, tone: "navy" },
  { label: "Maintenance", value: 7, tone: "warning" },
  { label: "VIP hold", value: 5, tone: "gold" },
];

export const recentReservations = [
  {
    id: "VH-240518-91",
    guest: "Maya Santoso",
    room: "Grand Horizon",
    status: "Confirmed",
    stay: "12 - 15 May",
    amount: "Rp 7.2M",
  },
  {
    id: "VH-240518-74",
    guest: "Lucas Hartanto",
    room: "Aurora Suite",
    status: "Awaiting payment",
    stay: "12 - 14 May",
    amount: "Rp 5.1M",
  },
  {
    id: "VH-240518-63",
    guest: "Aisha Rahman",
    room: "Presidential Villa",
    status: "Check-in today",
    stay: "13 - 18 May",
    amount: "Rp 12.4M",
  },
  {
    id: "VH-240518-40",
    guest: "Dimas Pratama",
    room: "Executive Twin",
    status: "Cancelled",
    stay: "19 - 21 May",
    amount: "Rp 3.8M",
  },
];

export const quickActions = [
  "Create booking hold",
  "Adjust room pricing",
  "Message guest",
  "Export daily report",
];

export const notifications = [
  {
    title: "Presidential Villa early arrival",
    body: "VIP transfer confirmed for 11:30 AM.",
    tone: "gold",
  },
  {
    title: "Maintenance cleared",
    body: "Executive Twin 402 is back online.",
    tone: "success",
  },
  {
    title: "Payment review needed",
    body: "3 reservations are awaiting verification.",
    tone: "warning",
  },
];

export const userRecords = [
  {
    id: "USR-1042",
    name: "Maya Santoso",
    email: "maya.santoso@email.com",
    role: "Guest",
    status: "Active",
    lastSeen: "2 min ago",
  },
  {
    id: "USR-1043",
    name: "Arvin Putra",
    email: "arvin.putra@velora.co",
    role: "Pengurus",
    status: "Active",
    lastSeen: "14 min ago",
  },
  {
    id: "USR-1044",
    name: "Nadia Lestari",
    email: "nadia.lestari@velora.co",
    role: "Admin",
    status: "Suspended",
    lastSeen: "Yesterday",
  },
  {
    id: "USR-1045",
    name: "Reza Mahendra",
    email: "reza@gmail.com",
    role: "Guest",
    status: "Active",
    lastSeen: "1 hour ago",
  },
  {
    id: "USR-1046",
    name: "Aline Wijaya",
    email: "aline@corp.co",
    role: "Guest",
    status: "Pending",
    lastSeen: "Pending review",
  },
];

export const roomInventory = [
  {
    id: "RM-301",
    name: "Aurora Suite",
    type: "Suite",
    price: "Rp 1.85M",
    occupancy: "2 guests",
    status: "Available",
    maintenance: "None",
  },
  {
    id: "RM-402",
    name: "Grand Horizon",
    type: "Ocean Front",
    price: "Rp 2.40M",
    occupancy: "3 guests",
    status: "Occupied",
    maintenance: "None",
  },
  {
    id: "RM-510",
    name: "Executive Twin",
    type: "Business",
    price: "Rp 1.35M",
    occupancy: "2 guests",
    status: "Maintenance",
    maintenance: "Fan service",
  },
  {
    id: "RM-901",
    name: "Presidential Villa",
    type: "Villa",
    price: "Rp 5.80M",
    occupancy: "4 guests",
    status: "VIP hold",
    maintenance: "Private dining setup",
  },
];

export const reservationRecords = [
  {
    id: "VH-240518-91",
    guest: "Maya Santoso",
    room: "Grand Horizon",
    status: "Confirmed",
    checkIn: "12 May, 15:00",
    checkOut: "15 May, 12:00",
  },
  {
    id: "VH-240518-74",
    guest: "Lucas Hartanto",
    room: "Aurora Suite",
    status: "Awaiting payment",
    checkIn: "12 May, 15:00",
    checkOut: "14 May, 12:00",
  },
  {
    id: "VH-240518-63",
    guest: "Aisha Rahman",
    room: "Presidential Villa",
    status: "Check-in today",
    checkIn: "13 May, 15:00",
    checkOut: "18 May, 12:00",
  },
  {
    id: "VH-240518-40",
    guest: "Dimas Pratama",
    room: "Executive Twin",
    status: "Cancelled",
    checkIn: "19 May, 15:00",
    checkOut: "21 May, 12:00",
  },
];

export const transactionRows = [
  {
    id: "TX-9912",
    room: "Grand Horizon",
    date: "18 Apr 2026",
    amount: "Rp 7.2M",
    status: "Paid",
  },
  {
    id: "TX-9913",
    room: "Aurora Suite",
    date: "18 Apr 2026",
    amount: "Rp 5.1M",
    status: "Paid",
  },
  {
    id: "TX-9914",
    room: "Presidential Villa",
    date: "19 Apr 2026",
    amount: "Rp 12.4M",
    status: "Refund pending",
  },
  {
    id: "TX-9915",
    room: "Executive Twin",
    date: "19 Apr 2026",
    amount: "Rp 3.8M",
    status: "Paid",
  },
];

export const financialSummary = [
  { label: "Gross revenue", value: "Rp 4.8B", delta: "+18.2%" },
  { label: "Net revenue", value: "Rp 3.9B", delta: "+15.1%" },
  { label: "Refunds", value: "Rp 82M", delta: "-4.2%" },
  { label: "Average ticket", value: "Rp 2.6M", delta: "+9.3%" },
];

export const revenueSeries = [
  { name: "Jan", revenue: 2.4 },
  { name: "Feb", revenue: 2.8 },
  { name: "Mar", revenue: 3.1 },
  { name: "Apr", revenue: 3.9 },
  { name: "May", revenue: 4.2 },
  { name: "Jun", revenue: 4.8 },
];

export const paymentMethods = [
  { name: "Card", value: 48 },
  { name: "Transfer", value: 34 },
  { name: "Wallet", value: 18 },
];

export const chatLogs = [
  {
    id: "CH-3301",
    reservationId: "VH-240518-91",
    guest: "Maya Santoso",
    room: "Grand Horizon",
    manager: "Arvin Putra",
    date: "18 Apr 2026",
    excerpt: "Could we arrange a spa slot after check-in?",
    flagged: false,
    messages: [
      { author: "Guest", text: "Could we arrange a spa slot after check-in?" },
      {
        author: "Manager",
        text: "Certainly, we have held a 7 PM treatment window.",
      },
      { author: "Guest", text: "Perfect, thank you." },
    ],
  },
  {
    id: "CH-3302",
    reservationId: "VH-240518-74",
    guest: "Lucas Hartanto",
    room: "Aurora Suite",
    manager: "Arvin Putra",
    date: "18 Apr 2026",
    excerpt: "Please confirm airport pickup and luggage handling.",
    flagged: false,
    messages: [
      {
        author: "Guest",
        text: "Please confirm airport pickup and luggage handling.",
      },
      {
        author: "Manager",
        text: "Pickup has been scheduled and bell service is ready.",
      },
    ],
  },
  {
    id: "CH-3303",
    reservationId: "VH-240518-63",
    guest: "Aisha Rahman",
    room: "Presidential Villa",
    manager: "Nadia Lestari",
    date: "19 Apr 2026",
    excerpt: "Can we get a higher floor and extra pillows?",
    flagged: true,
    messages: [
      { author: "Guest", text: "Can we get a higher floor and extra pillows?" },
      { author: "Manager", text: "Both have been confirmed for your arrival." },
    ],
  },
];
