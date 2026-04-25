export const ROOMS = [
  {
    id: 1,
    name: "Deluxe Suite",
    price: 1850000,
    size: "45 m²",
    bed: "King Bed",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    tag: "Most Popular",
    features: ["City View", "Breakfast Included", "Free WiFi"],
  },
  {
    id: 2,
    name: "Grand Ocean Room",
    price: 2400000,
    size: "60 m²",
    bed: "King Bed",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    tag: "Premium",
    features: ["Ocean View", "Private Balcony", "Butler Service"],
  },
  {
    id: 3,
    name: "Executive Twin",
    price: 1350000,
    size: "38 m²",
    bed: "Twin Beds",
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    tag: "Best Value",
    features: ["Garden View", "Work Desk", "Free WiFi"],
  },
  {
    id: 4,
    name: "Presidential Suite",
    price: 5800000,
    size: "120 m²",
    bed: "King Bed",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    tag: "Exclusive",
    features: ["Panoramic View", "Private Pool", "24hr Butler"],
  },
];

export const AMENITIES = [
  {
    icon: "🍽️",
    title: "Fine Dining",
    desc: "Restoran premium dengan chef internasional dan menu lokal autentik.",
  },
  {
    icon: "🏊",
    title: "Infinity Pool",
    desc: "Kolam renang outdoor infinity dengan pemandangan cakrawala kota.",
  },
  {
    icon: "💆",
    title: "Velora Spa",
    desc: "Perawatan tubuh eksklusif dengan terapi tradisional dan modern.",
  },
  {
    icon: "🏋️",
    title: "Fitness Centre",
    desc: "Pusat kebugaran 24 jam dengan instruktur personal berpengalaman.",
  },
  {
    icon: "🎭",
    title: "Event Hall",
    desc: "Ballroom megah untuk pernikahan, konferensi, dan acara privat.",
  },
  {
    icon: "🚗",
    title: "Valet Parking",
    desc: "Layanan parkir valet profesional tersedia setiap saat.",
  },
];

export const TESTIMONIALS = [
  {
    name: "Anastasia W.",
    origin: "Jakarta",
    rating: 5,
    text: "Pengalaman menginap yang benar-benar luar biasa. Setiap detail diperhatikan dengan sempurna. Velora Hotel mendefinisikan ulang standar kemewahan.",
    stay: "Presidential Suite",
    avatar: "AW",
  },
  {
    name: "Reza Mahendra",
    origin: "Surabaya",
    rating: 5,
    text: "Sistem reservasi yang sangat mudah dan responsif. Staff yang ramah, kamar yang elegan. Kami pasti akan kembali untuk anniversary berikutnya.",
    stay: "Grand Ocean Room",
    avatar: "RM",
  },
  {
    name: "Sinta Dewi",
    origin: "Bandung",
    rating: 5,
    text: "Velora Spa adalah highlight dari kunjungan kami. Layanan butler personal membuat kami merasa seperti raja dan ratu. Highly recommended!",
    stay: "Deluxe Suite",
    avatar: "SD",
  },
];

export const STATS = [
  { value: "12+", label: "Tahun Berpengalaman" },
  { value: "98%", label: "Kepuasan Tamu" },
  { value: "250+", label: "Kamar Premium" },
  { value: "45+", label: "Penghargaan" },
];

export const CONTACTS = [
  {
    icon: "📍",
    label: "Alamat",
    value: "Jl. Raya Sudirman No. 1, Jakarta Pusat 10220",
  },
  {
    icon: "📞",
    label: "Telepon",
    value: "+62 21 5000 7777",
  },
  {
    icon: "✉️",
    label: "Email",
    value: "reservasi@velorahotel.com",
  },
  {
    icon: "🕐",
    label: "Check-in / Check-out",
    value: "Fleksibel sesuai reservasi",
  },
];

export const FOOTER_COLUMNS = [
  {
    title: "Reservasi",
    links: [
      "Kamar & Suite",
      "Paket Honeymoon",
      "Meeting Package",
      "Group Booking",
    ],
  },
  {
    title: "Fasilitas",
    links: ["Velora Spa", "Fine Dining", "Infinity Pool", "Event Hall"],
  },
  {
    title: "Informasi",
    links: ["Tentang Kami", "Kontak", "Kebijakan", "FAQ"],
  },
];
