export const staffProfile = {
  name: "Maya Wibowo",
  role: "Pengurus Shift Lead",
  desk: "Concierge Desk A2",
};

export const pengurusDashboardSummary = [
  {
    label: "Pending Reservations",
    value: 5,
    detail: "Awaiting payment or room allocation",
    tone: "warning",
  },
  {
    label: "Confirmed Today",
    value: 3,
    detail: "Ready for arrival coordination",
    tone: "success",
  },
  {
    label: "Check-In Today",
    value: 4,
    detail: "Front desk and housekeeping alignment",
    tone: "navy",
  },
  {
    label: "Open Support Tickets",
    value: 2,
    detail: "Unassigned queue visible to staff",
    tone: "gold",
  },
];

export const reservationSeed = [
  {
    id: "RV-2604-118",
    guestName: "Amara Wibowo",
    roomType: "Presidential Suite",
    roomNumber: "1208",
    checkIn: "12 May, 15:00",
    checkOut: "15 May, 12:00",
    paymentMethod: "Corporate card",
    paymentStatus: "Paid",
    status: "Confirmed",
    tone: "success",
    note: "VIP arrival with airport pickup and floral setup.",
  },
  {
    id: "RV-2604-121",
    guestName: "Lucas Hartanto",
    roomType: "Executive Room",
    roomNumber: "814",
    checkIn: "12 May, 18:00",
    checkOut: "14 May, 12:00",
    paymentMethod: "Visa · 2048",
    paymentStatus: "Pending",
    status: "Pending",
    tone: "warning",
    note: "Awaiting payment verification before room hold is released.",
  },
  {
    id: "RV-2604-126",
    guestName: "Sinta Dewi",
    roomType: "Deluxe Room",
    roomNumber: "502",
    checkIn: "13 May, 14:00",
    checkOut: "14 May, 12:00",
    paymentMethod: "Transfer",
    paymentStatus: "Paid",
    status: "Checked-In",
    tone: "navy",
    note: "Guest already arrived. Front desk noted extra towels.",
  },
  {
    id: "RV-2604-133",
    guestName: "Nadya Putri",
    roomType: "Deluxe Room",
    roomNumber: "304",
    checkIn: "13 May, 16:00",
    checkOut: "15 May, 12:00",
    paymentMethod: "Corporate card",
    paymentStatus: "Paid",
    status: "Confirmed",
    tone: "success",
    note: "Early check-in requested, waiting for housekeeping release.",
  },
  {
    id: "RV-2604-136",
    guestName: "Reza Mahendra",
    roomType: "Executive Room",
    roomNumber: "1102",
    checkIn: "14 May, 15:00",
    checkOut: "16 May, 12:00",
    paymentMethod: "Wallet",
    paymentStatus: "Pending",
    status: "Pending",
    tone: "warning",
    note: "Needs payment follow-up and quiet-floor allocation.",
  },
];

export const ticketSeed = [
  {
    id: "TK-2048",
    reservationRef: "RV-2604-118",
    roomNumber: "1208",
    guestName: "Amara Wibowo",
    lastMessage: "Can we confirm the spa booking for 6 PM?",
    unread: 2,
    status: "Open",
    assignedTo: null,
    roomType: "Presidential Suite",
    checkIn: "12 May, 15:00",
    checkOut: "15 May, 12:00",
    messages: [
      {
        author: "Guest",
        text: "Can we confirm the spa booking for 6 PM?",
        time: "2m",
      },
      {
        author: "Guest",
        text: "Also, could the concierge arrange a late dinner table?",
        time: "1m",
      },
    ],
  },
  {
    id: "TK-2051",
    reservationRef: "RV-2604-121",
    roomNumber: "814",
    guestName: "Lucas Hartanto",
    lastMessage: "Please confirm airport pickup and luggage handling.",
    unread: 1,
    status: "Open",
    assignedTo: null,
    roomType: "Executive Room",
    checkIn: "12 May, 18:00",
    checkOut: "14 May, 12:00",
    messages: [
      {
        author: "Guest",
        text: "Please confirm airport pickup and luggage handling.",
        time: "8m",
      },
    ],
  },
  {
    id: "TK-2054",
    reservationRef: "RV-2604-126",
    roomNumber: "502",
    guestName: "Sinta Dewi",
    lastMessage: "Thank you, towels received and minibar restocked.",
    unread: 0,
    status: "In Progress",
    assignedTo: staffProfile.name,
    roomType: "Deluxe Room",
    checkIn: "13 May, 14:00",
    checkOut: "14 May, 12:00",
    messages: [
      {
        author: "Guest",
        text: "Could we get extra towels and water bottles?",
        time: "14m",
      },
      {
        author: "Staff",
        text: "Of course. Housekeeping is already on the way.",
        time: "11m",
      },
      {
        author: "Guest",
        text: "Thank you, towels received and minibar restocked.",
        time: "6m",
      },
    ],
  },
  {
    id: "TK-2059",
    reservationRef: "RV-2604-133",
    roomNumber: "304",
    guestName: "Nadya Putri",
    lastMessage: "Early check-in approved by housekeeping.",
    unread: 0,
    status: "Resolved",
    assignedTo: staffProfile.name,
    roomType: "Deluxe Room",
    checkIn: "13 May, 16:00",
    checkOut: "15 May, 12:00",
    messages: [
      {
        author: "Guest",
        text: "Can I arrive early if the room is ready?",
        time: "1h",
      },
      {
        author: "Staff",
        text: "Yes, we can release the room if housekeeping completes by 13:30.",
        time: "56m",
      },
      {
        author: "Staff",
        text: "Housekeeping confirmed. Early check-in approved.",
        time: "12m",
      },
    ],
  },
];

export const todayCheckIns = [
  ["Amara Wibowo", "1208", "VIP pickup"],
  ["Lucas Hartanto", "814", "Pending payment"],
  ["Sinta Dewi", "502", "In room"],
];

export const bookingRequests = [
  ["Amara Wibowo", "Executive lounge upgrade", "High"],
  ["Lucas Hartanto", "Payment follow-up", "Urgent"],
  ["Nadya Putri", "Early check-in review", "Medium"],
];

export const quickCards = [
  ["Room assignments", "12 updated", "Shift handoff complete"],
  ["Maintenance holds", "04 flagged", "Two rooms awaiting release"],
  ["Guest follow-up", "09 unread", "Concierge queue active"],
];

export const reservationTabs = ["Pending", "Confirmed", "Checked-In"];
export const supportFilters = [
  "All",
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
];
