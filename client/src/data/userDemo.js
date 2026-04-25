import {
  BedDouble,
  CalendarDays,
  CreditCard,
  LayoutGrid,
  MessageSquareText,
  Sparkles,
  UserRound,
} from "lucide-react";

export const userNavItems = [
  { to: "/user/dashboard", label: "Home", icon: LayoutGrid },
  { to: "/user/rooms", label: "Rooms", icon: BedDouble },
  { to: "/user/my-reservations", label: "Reservations", icon: CalendarDays },
  { to: "/user/chat", label: "Chat", icon: MessageSquareText },
  { to: "/user/profile", label: "Profile", icon: UserRound },
];

export const dashboardSummary = [
  {
    label: "Active Reservations",
    value: "02",
    detail: "One confirmed, one arriving soon",
    tone: "navy",
  },
  {
    label: "Pending Reservations",
    value: "01",
    detail: "Payment waiting approval",
    tone: "gold",
  },
  {
    label: "Chat Messages",
    value: "18",
    detail: "Concierge and room service replies",
    tone: "success",
  },
];

export const dashboardActions = [
  {
    label: "Find Rooms",
    detail: "Browse live availability and compare suites",
    to: "/user/rooms",
    icon: BedDouble,
  },
  {
    label: "My Reservations",
    detail: "Review schedules, payment, and status",
    to: "/user/reservations",
    icon: CalendarDays,
  },
  {
    label: "Chat with Hotel",
    detail: "Ask about services before or during a stay",
    to: "/user/chat",
    icon: MessageSquareText,
  },
];

export const promoOffer = {
  title: "Signature Weeknight Offer",
  description:
    "Book a Deluxe or Executive room before midnight and receive breakfast for two plus a late checkout window.",
  note: "Limited to selected dates",
};

export const dashboardTimeline = [
  {
    label: "Confirmed",
    value: "Grand Horizon - 12 May, 15:00",
    tone: "success",
  },
  {
    label: "Payment review",
    value: "Aurora Suite - awaiting approval",
    tone: "warning",
  },
  {
    label: "Chat update",
    value: "Concierge confirmed airport pickup",
    tone: "gold",
  },
];

export const roomTypes = [
  {
    id: "deluxe-room",
    name: "Deluxe Room",
    hourlyPrice: 280000,
    availableUnits: 3,
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80",
    description:
      "A bright, quiet room for short luxury stays with skyline views and refined essentials.",
    badges: ["City view", "Queen bed", "Breakfast"],
    detailPath: "/user/rooms/deluxe-room",
  },
  {
    id: "executive-room",
    name: "Executive Room",
    hourlyPrice: 380000,
    availableUnits: 5,
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
    description:
      "Balanced for work and rest with premium desk space and calm, warm materials.",
    badges: ["Work desk", "Rain shower", "Lounge access"],
    detailPath: "/user/rooms/executive-room",
  },
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    hourlyPrice: 920000,
    availableUnits: 1,
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
    description:
      "The property signature with private dining, panoramic lounge, and elevated service.",
    badges: ["Private pool", "Butler service", "Ocean view"],
    detailPath: "/user/rooms/presidential-suite",
  },
];

export const roomDetails = {
  "deluxe-room": {
    name: "Deluxe Room",
    heroImages: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1400&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1400&q=80",
    ],
    hourlyPrice: 280000,
    availableUnits: 3,
    availability: "Available today",
    size: "32 m2",
    occupancy: "2 guests",
    summary:
      "A calm, light-filled room designed for short premium stays with a soft hospitality tone.",
    facilities: [
      "King bed",
      "Blackout drapes",
      "Smart TV",
      "Rain shower",
      "Mini bar",
      "Work desk",
    ],
  },
  "executive-room": {
    name: "Executive Room",
    heroImages: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1400&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&q=80",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1400&q=80",
    ],
    hourlyPrice: 380000,
    availableUnits: 5,
    availability: "High availability",
    size: "38 m2",
    occupancy: "2 guests",
    summary:
      "A balanced workspace-stay suite with lounge access and a more polished business feel.",
    facilities: [
      "Executive desk",
      "Lounge access",
      "Fast Wi-Fi",
      "Sound insulation",
      "Espresso corner",
      "Rain shower",
    ],
  },
  "presidential-suite": {
    name: "Presidential Suite",
    heroImages: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1400&q=80",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1400&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1400&q=80",
    ],
    hourlyPrice: 920000,
    availableUnits: 1,
    availability: "Limited availability",
    size: "120 m2",
    occupancy: "4 guests",
    summary:
      "The highest expression of the property, with panoramic lounge space and private service.",
    facilities: [
      "Private pool",
      "Butler service",
      "Dining salon",
      "Panoramic lounge",
      "Spa bath",
      "Chef on request",
    ],
  },
};

export const bookingPlan = {
  roomName: "Executive Room",
  hourlyRate: 380000,
  minHours: 3,
  paymentMethods: [
    {
      id: "pay-check-in",
      label: "Pay at Check-In",
      note: "Reserve now, settle on arrival",
    },
    {
      id: "pay-online",
      label: "Pay Online",
      note: "Instant confirmation for the stay",
    },
  ],
};

export const reservationCards = [
  {
    room: "Grand Horizon",
    roomNumber: "1208",
    schedule: "12 May, 15:00 - 15 May, 12:00",
    status: "confirmed",
    payment: "paid",
  },
  {
    room: "Aurora Suite",
    roomNumber: "0814",
    schedule: "24 Feb, 15:00 - 27 Feb, 12:00",
    status: "pending",
    payment: "pending",
  },
  {
    room: "Presidential Suite",
    roomNumber: "1901",
    schedule: "30 Jun, 15:00 - 02 Jul, 12:00",
    status: "checked-in",
    payment: "paid",
  },
  {
    room: "Executive Room",
    roomNumber: "0422",
    schedule: "14 Jan, 15:00 - 16 Jan, 12:00",
    status: "completed",
    payment: "refunded",
  },
];

export const chatThreads = [
  {
    id: "pre-booking",
    title: "Pre-booking inquiry",
    subtitle: "Ask about availability, airport pickup, and room types",
    status: "Before booking",
    avatar: "CH",
    messages: [
      {
        author: "Chandra",
        text: "Is there a Deluxe Room available for a short weekday stay?",
      },
      {
        author: "Velora Concierge",
        text: "Yes, three Deluxe Rooms are currently open with breakfast and late checkout options.",
      },
      {
        author: "Chandra",
        text: "Please hold one room while I review the booking summary.",
      },
    ],
  },
  {
    id: "post-booking",
    title: "Post-booking service",
    subtitle: "Room service, maintenance, and arrival coordination",
    status: "During stay",
    avatar: "VS",
    messages: [
      {
        author: "Velora Support",
        text: "Your airport pickup has been confirmed for 14:20 and the minibar has been pre-stocked.",
      },
      {
        author: "Chandra",
        text: "Could I get an extra set of towels and a dinner reservation?",
      },
      {
        author: "Velora Support",
        text: "Absolutely. Housekeeping is on the way and we are securing a corner table at 19:30.",
      },
    ],
  },
];

export const profileHighlights = [
  {
    label: "Guest tier",
    value: "Signature Member",
    icon: Sparkles,
  },
  {
    label: "Saved preferences",
    value: "High floor, quiet room, espresso",
    icon: UserRound,
  },
  {
    label: "Payment methods",
    value: "Visa ending 2048",
    icon: CreditCard,
  },
];
