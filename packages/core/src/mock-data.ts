import type { Booking, BookingSuggestion, Client, DashboardSummary, Service, Technician } from "./types";

export const technicians: Technician[] = [
  { id: "tech-1", name: "Andrea", specialty: "Gel y diseno fino", chair: "Cabina A" },
  { id: "tech-2", name: "Lucia", specialty: "Acrilico y rellenos", chair: "Cabina B" },
  { id: "tech-3", name: "Marta", specialty: "Pedicura spa", chair: "Cabina C" }
];

export const services: Service[] = [
  { id: "srv-1", name: "Manicura semipermanente", category: "manos", durationMinutes: 60, price: 28, allowsDesignExtra: true },
  { id: "srv-2", name: "Relleno acrilico", category: "manos", durationMinutes: 90, price: 42, allowsDesignExtra: true },
  { id: "srv-3", name: "Pedicura spa", category: "pies", durationMinutes: 75, price: 36, allowsDesignExtra: false },
  { id: "srv-4", name: "Diseno extra", category: "extras", durationMinutes: 15, price: 8, allowsDesignExtra: false },
  { id: "srv-5", name: "Pack manos + pies", category: "packs", durationMinutes: 120, price: 58, allowsDesignExtra: true }
];

export const clients: Client[] = [
  {
    id: "cli-1",
    name: "Paula Rivas",
    phone: "+34 611 222 333",
    email: "paula@nails.test",
    birthday: "1994-07-19",
    visits: 12,
    lastVisit: "2026-03-01",
    vip: true,
    allergies: ["Latex"],
    favoriteColors: ["Nude", "Rojo vino"],
    usualShape: "Almendra",
    usualLength: "Media",
    lastPhotos: [
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "cli-2",
    name: "Elena Soto",
    phone: "+34 622 010 445",
    visits: 4,
    lastVisit: "2026-02-24",
    vip: false,
    allergies: [],
    favoriteColors: ["Francesa", "Rosa palo"],
    usualShape: "Cuadrada",
    usualLength: "Corta",
    lastPhotos: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "cli-3",
    name: "Sara Medina",
    phone: "+34 655 987 123",
    email: "sara@nails.test",
    visits: 18,
    lastVisit: "2026-03-10",
    vip: true,
    allergies: ["Acetona fuerte"],
    favoriteColors: ["Cromo", "Negro"],
    usualShape: "Stiletto",
    usualLength: "Larga",
    lastPhotos: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80"
    ]
  }
];

export const bookings: Booking[] = [
  {
    id: "bok-1",
    clientId: "cli-1",
    serviceId: "srv-2",
    technicianId: "tech-2",
    start: "2026-03-12T09:00:00+01:00",
    durationMinutes: 90,
    price: 42,
    status: "prevista",
    isNewClient: false,
    notes: "Quiere repetir el diseno de la ultima visita"
  },
  {
    id: "bok-2",
    clientId: "cli-2",
    serviceId: "srv-1",
    technicianId: "tech-1",
    start: "2026-03-12T10:30:00+01:00",
    durationMinutes: 60,
    price: 28,
    status: "en_curso",
    isNewClient: true
  },
  {
    id: "bok-3",
    clientId: "cli-3",
    serviceId: "srv-5",
    technicianId: "tech-3",
    start: "2026-03-12T12:30:00+01:00",
    durationMinutes: 120,
    price: 58,
    status: "completada",
    isNewClient: false
  },
  {
    id: "bok-4",
    clientId: "cli-2",
    serviceId: "srv-3",
    technicianId: "tech-3",
    start: "2026-03-12T16:00:00+01:00",
    durationMinutes: 75,
    price: 36,
    status: "cancelada",
    isNewClient: false
  }
];

export const bookingSuggestions: BookingSuggestion[] = [
  {
    technicianId: "tech-1",
    slots: ["13:30", "17:00", "18:15"]
  },
  {
    technicianId: "tech-2",
    slots: ["11:15", "15:45"]
  },
  {
    technicianId: "tech-3",
    slots: ["09:30", "14:45", "18:00"]
  }
];

export const dashboardSummary: DashboardSummary = {
  appointmentsToday: 12,
  availableSlots: 7,
  estimatedIncome: 386,
  realizedIncome: 228,
  cancellations: 2,
  noShows: 1
};

export function getClientById(clientId: string) {
  return clients.find((client) => client.id === clientId);
}

export function getServiceById(serviceId: string) {
  return services.find((service) => service.id === serviceId);
}

export function getTechnicianById(technicianId: string) {
  return technicians.find((technician) => technician.id === technicianId);
}

