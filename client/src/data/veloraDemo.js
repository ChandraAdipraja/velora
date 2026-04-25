import { CreditCard, Sparkles, UserRound } from "lucide-react";

export const heroStats = [
  { value: "98%", label: "Guest satisfaction" },
  { value: "24/7", label: "Concierge coverage" },
  { value: "142", label: "Luxury suites" },
  { value: "17 min", label: "Average check-in" },
];

export const roomListings = [
  {
    id: "deluxe-room",
    name: "Deluxe Room",
    hourlyPrice: 280000,
    availableUnits: 3,
    size: "32 m²",
    occupancy: "2 guests",
    status: "City view",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
    badges: ["City view", "Breakfast", "Walk-in shower"],
    detailPath: "/user/rooms/deluxe-room",
    bookingPath: "/user/reservation",
  },
  {
    id: "executive-room",
    name: "Executive Room",
    hourlyPrice: 380000,
    availableUnits: 5,
    size: "38 m²",
    occupancy: "2 guests",
    status: "Business ready",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80",
    badges: ["Work desk", "Lounge access", "Rain shower"],
    detailPath: "/user/rooms/executive-room",
    bookingPath: "/user/reservation",
  },
  {
    id: "presidential-suite",
    name: "Presidential Suite",
    hourlyPrice: 920000,
    availableUnits: 1,
    size: "120 m²",
    occupancy: "2 guests",
    status: "Signature stay",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900&q=80",
    badges: ["Private pool", "Butler service", "Ocean view"],
    detailPath: "/user/rooms/presidential-suite",
    bookingPath: "/user/reservation",
  },
];

export const bookingQueue = [
  {
    name: "Amara Wibowo",
    room: "Grand Horizon",
    dates: "12 - 15 May",
    status: "Confirmed",
    tone: "success",
  },
  {
    name: "Lucas Hartanto",
    room: "Aurora Suite",
    dates: "12 - 14 May",
    status: "Awaiting payment",
    tone: "warning",
  },
  {
    name: "Aisha Rahman",
    room: "Presidential Villa",
    dates: "13 - 18 May",
    status: "VIP hold",
    tone: "navy",
  },
];

export const reservationTimeline = [
  { label: "Booking reference", value: "VH-240518-91" },
  { label: "Check-in", value: "12 May 2026, 15:00" },
  { label: "Check-out", value: "15 May 2026, 12:00" },
  { label: "Guests", value: "2 adults · 1 child" },
];

export const guestProfile = {
  name: "Maya Santoso",
  tier: "Signature Member",
  city: "Jakarta",
  stays: 14,
  points: 28400,
  nextStay: "Grand Horizon · 12 May",
  preferences: ["High floor", "Late checkout", "Sparkling water"],
};

export const analyticsSummary = [
  {
    label: "Monthly revenue",
    value: "Rp 4.8B",
    detail: "+18.2% vs last month",
  },
  { label: "Occupancy rate", value: "86%", detail: "Peak demand on weekends" },
  { label: "ADR", value: "Rp 1.92M", detail: "Average daily rate" },
  { label: "Repeat guests", value: "41%", detail: "Loyalty members booked" },
];

export const revenueBars = [22, 34, 28, 40, 52, 48, 60, 66, 58, 72, 74, 84];

export const occupancyBars = [64, 68, 72, 70, 76, 84, 88];

export const testimonials = [
  {
    name: "Anastasia W.",
    origin: "Jakarta",
    text: "The booking flow feels calm and deliberate. It matches the level of service the hotel promises.",
  },
  {
    name: "Reza Mahendra",
    origin: "Surabaya",
    text: "Every screen looks premium without becoming heavy. It is clear where to book, manage, and analyze.",
  },
  {
    name: "Sinta Dewi",
    origin: "Bandung",
    text: "The analytics and guest views feel like a real operating system for luxury hospitality.",
  },
];

export const trustSignals = [
  "Curated rooms and suites",
  "Secure reservation workflow",
  "Real-time operational views",
  "Guest loyalty tracking",
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

export const preBookingQuestions = [
  "How many Deluxe rooms are available?",
  "What is the hourly rate for Deluxe?",
  "What facilities are included in Executive rooms?",
  "Can I request late checkout?",
  "Are there special room packages?",
];

export const preBookingReplies = {
  "How many Deluxe rooms are available?": {
    title: "Deluxe availability",
    summary:
      "Three Deluxe Rooms are available right now with city-view orientation and breakfast included.",
    details: [
      "3 rooms available",
      "Best for 1-2 guests",
      "Instant hold available",
    ],
  },
  "What is the hourly rate for Deluxe?": {
    title: "Deluxe hourly rate",
    summary:
      "Deluxe Rooms start at Rp 280,000 per hour and can be reserved with a 3-hour minimum window.",
    details: [
      "From Rp 280,000 / hour",
      "3-hour minimum",
      "Late checkout options available",
    ],
  },
  "What facilities are included in Executive rooms?": {
    title: "Executive room facilities",
    summary:
      "Executive Rooms include a premium desk, rain shower, lounge access, and high-speed Wi-Fi.",
    details: ["Executive desk", "Lounge access", "Rain shower", "Fast Wi-Fi"],
  },
  "Can I request late checkout?": {
    title: "Late checkout policy",
    summary:
      "Yes. Late checkout requests are usually approved based on occupancy and are confirmed by concierge.",
    details: [
      "Subject to occupancy",
      "Confirmed by staff",
      "Ideal for business stays",
    ],
  },
  "Are there special room packages?": {
    title: "Special room packages",
    summary:
      "We periodically offer stay bundles that include breakfast, spa access, and early check-in benefits.",
    details: [
      "Breakfast bundles",
      "Spa access",
      "Early check-in",
      "Limited-time offers",
    ],
  },
};

export const supportTickets = [
  {
    id: "RV1024",
    roomNumber: "102",
    checkIn: "10:00",
    checkOut: "14:00",
    status: "Active",
    unread: 2,
    lastMessage: "Housekeeping confirmed the extra towels.",
    room: "Grand Horizon",
    messages: [
      {
        author: "Staff",
        text: "Welcome back, Chandra. How can we assist with your stay today?",
      },
      {
        author: "You",
        text: "Please arrange an extra set of towels and a dinner table for two.",
      },
      {
        author: "Staff",
        text: "Done. Housekeeping is on the way and the table is reserved for 19:30.",
      },
      {
        author: "You",
        text: "Done. Housekeeping is on the way and the table is reserved for 19:30.",
      },
      {
        author: "Staff",
        text: "Done. Housekeeping is on the way and the table is reserved for 19:30.",
      },
      {
        author: "You",
        text: "Done. Housekeeping is on the way and the table is reserved for 19:30.",
      },
      {
        author: "Staff",
        text: "Done. Housekeeping is on the way and the table is reserved for 19:30.",
      },
    ],
  },
  {
    id: "RV1028",
    roomNumber: "814",
    checkIn: "15:00",
    checkOut: "12:00",
    status: "Pending",
    unread: 1,
    lastMessage: "Airport pickup is being prepared.",
    room: "Executive Room",
    messages: [
      {
        author: "Staff",
        text: "We’re reviewing your arrival window and preparing the pickup request.",
      },
      {
        author: "You",
        text: "Please confirm if my flight lands before 15:00.",
      },
    ],
  },
  {
    id: "RV1028",
    roomNumber: "814",
    checkIn: "15:00",
    checkOut: "12:00",
    status: "Pending",
    unread: 1,
    lastMessage: "Airport pickup is being prepared.",
    room: "Executive Room",
    messages: [
      {
        author: "Staff",
        text: "We’re reviewing your arrival window and preparing the pickup request.",
      },
      {
        author: "You",
        text: "Please confirm if my flight lands before 15:00.",
      },
    ],
  },
  {
    id: "RV1028",
    roomNumber: "814",
    checkIn: "15:00",
    checkOut: "12:00",
    status: "Pending",
    unread: 1,
    lastMessage: "Airport pickup is being prepared.",
    room: "Executive Room",
    messages: [
      {
        author: "Staff",
        text: "We’re reviewing your arrival window and preparing the pickup request.",
      },
      {
        author: "You",
        text: "Please confirm if my flight lands before 15:00.",
      },
    ],
  },
];
