// Mock data for the Black & Blade Barbershop app

export const barbers = [
  {
    id: 1,
    name: "Marco",
    specialty: "Navaja Maestra",
    rating: 4.9,
    reviews: 142,
    avatar: "https://i.pravatar.cc/150?img=8",
    available: true,
  },
  {
    id: 2,
    name: "Lukas",
    specialty: "Fade Specialist",
    rating: 4.8,
    reviews: 98,
    avatar: "https://i.pravatar.cc/150?img=11",
    available: true,
  },
  {
    id: 3,
    name: "Elena",
    specialty: "Classic Stylist",
    rating: 5.0,
    reviews: 76,
    avatar: "https://i.pravatar.cc/150?img=47",
    available: false,
  },
  {
    id: 4,
    name: "Daniel",
    specialty: "Skin Fade Expert",
    rating: 4.7,
    reviews: 55,
    avatar: "https://i.pravatar.cc/150?img=15",
    available: true,
  },
];

export const services = [
  {
    id: 1,
    name: "Corte Clásico",
    description: "Corte tradicional con tijera y navaja",
    price: 250,
    duration: 30,
    icon: "content_cut",
    category: "Corte",
  },
  {
    id: 2,
    name: "Perfilado de Barba",
    description: "Perfilado a navaja con aceites esenciales",
    price: 180,
    duration: 20,
    icon: "face",
    category: "Barba",
  },
  {
    id: 3,
    name: "Corte + Barba Combo",
    description: "El paquete completo para el caballero moderno",
    price: 380,
    duration: 50,
    icon: "auto_awesome",
    category: "Combo",
  },
  {
    id: 4,
    name: "Skin Fade",
    description: "Degradado a piel con máquina y acabado perfecto",
    price: 300,
    duration: 40,
    icon: "settings",
    category: "Corte",
  },
  {
    id: 5,
    name: "Afeitado Tradicional",
    description: "Afeitado con navaja de barbero y toalla caliente",
    price: 220,
    duration: 35,
    icon: "spa",
    category: "Barba",
  },
  {
    id: 6,
    name: "Corte Niño",
    description: "Corte especial para los más pequeños",
    price: 180,
    duration: 25,
    icon: "child_care",
    category: "Corte",
  },
];

export const upcomingAppointments = [
  {
    id: 101,
    service: "Corte Clásico",
    barber: "Marco",
    barberId: 1,
    date: "2026-03-26",
    time: "10:30",
    status: "confirmed",
    price: 250,
  },
  {
    id: 102,
    service: "Perfilado de Barba",
    barber: "Elena",
    barberId: 3,
    date: "2026-04-02",
    time: "14:00",
    status: "confirmed",
    price: 180,
  },
];

export const pastAppointments = [
  {
    id: 98,
    service: "Corte + Barba Combo",
    barber: "Marco",
    barberId: 1,
    date: "2026-03-10",
    time: "11:00",
    status: "completed",
    price: 380,
  },
  {
    id: 95,
    service: "Skin Fade",
    barber: "Lukas",
    barberId: 2,
    date: "2026-02-22",
    time: "09:30",
    status: "completed",
    price: 300,
  },
  {
    id: 90,
    service: "Corte Clásico",
    barber: "Marco",
    barberId: 1,
    date: "2026-02-05",
    time: "16:00",
    status: "cancelled",
    price: 250,
  },
];

export const adminAppointments = [
  {
    id: 201,
    client: "Ricardo Casares",
    clientType: "Platinum",
    initials: "RC",
    service: "Corte Ejecutivo + Barba",
    barber: "Marco S.",
    time: "14:30",
    status: "en_curso",
    price: 380,
  },
  {
    id: 202,
    client: "Julian Moreno",
    clientType: "Nuevo",
    initials: "JM",
    service: "Skin Fade + Lavado",
    barber: "Daniel V.",
    time: "15:15",
    status: "confirmed",
    price: 300,
  },
  {
    id: 203,
    client: "Adrian Hernandez",
    clientType: "Frecuente",
    initials: "AH",
    service: "Afeitado Tradicional",
    barber: "Oscar L.",
    time: "16:00",
    status: "confirmed",
    price: 220,
  },
  {
    id: 204,
    client: "Carlos Ruiz",
    clientType: "Frecuente",
    initials: "CR",
    service: "Corte Clásico",
    barber: "Marco S.",
    time: "16:45",
    status: "confirmed",
    price: 250,
  },
  {
    id: 205,
    client: "Sofía Mendez",
    clientType: "Nueva",
    initials: "SM",
    service: "Corte + Barba Combo",
    barber: "Lukas F.",
    time: "17:30",
    status: "confirmed",
    price: 380,
  },
];

export const clients = [
  { id: 1, name: "Ricardo Casares", email: "r.casares@email.com", phone: "+52 55 1234 5678", visits: 28, total: 8400, lastVisit: "2026-03-24", type: "Platinum" },
  { id: 2, name: "Julian Moreno", email: "julian.m@email.com", phone: "+52 55 9876 5432", visits: 2, total: 550, lastVisit: "2026-03-20", type: "Nuevo" },
  { id: 3, name: "Adrian Hernandez", email: "adrianh@email.com", phone: "+52 55 5555 3333", visits: 15, total: 3600, lastVisit: "2026-03-18", type: "Frecuente" },
  { id: 4, name: "Carlos Ruiz", email: "carlos.r@email.com", phone: "+52 55 1111 2222", visits: 9, total: 2250, lastVisit: "2026-03-15", type: "Frecuente" },
  { id: 5, name: "Sofía Mendez", email: "sofia.m@email.com", phone: "+52 55 6666 7777", visits: 1, total: 380, lastVisit: "2026-03-10", type: "Nueva" },
  { id: 6, name: "Jorge Villanueva", email: "jorge.v@email.com", phone: "+52 55 8888 9999", visits: 22, total: 6600, lastVisit: "2026-03-08", type: "Platinum" },
];

export const timeSlots = {
  morning: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
  afternoon: ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
  evening: ["18:00", "18:30", "19:00"],
};

export const unavailableSlots = ["10:00"];

export const financialData = {
  monthly: {
    current: 42500,
    previous: 38200,
    change: "+11.3%",
  },
  byBarber: [
    { name: "Marco S.", revenue: 18200, appointments: 62 },
    { name: "Lukas F.", revenue: 12400, appointments: 48 },
    { name: "Elena R.", revenue: 7800, appointments: 35 },
    { name: "Daniel V.", revenue: 4100, appointments: 22 },
  ],
  topService: "Corte + Barba Combo",
  cancellationRate: "4.2%",
  peakHours: "10:00 - 12:00",
};
