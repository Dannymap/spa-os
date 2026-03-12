export type AppointmentStatus =
  | "prevista"
  | "en_curso"
  | "completada"
  | "cancelada"
  | "no_show";

export type Service = {
  id: string;
  name: string;
  category: "manos" | "pies" | "extras" | "packs";
  durationMinutes: number;
  price: number;
  allowsDesignExtra: boolean;
};

export type Technician = {
  id: string;
  name: string;
  specialty: string;
  chair: string;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthday?: string;
  visits: number;
  lastVisit: string;
  vip: boolean;
  allergies: string[];
  favoriteColors: string[];
  usualShape: string;
  usualLength: string;
  lastPhotos: string[];
};

export type Booking = {
  id: string;
  clientId: string;
  serviceId: string;
  technicianId: string;
  start: string;
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  isNewClient: boolean;
  notes?: string;
};

export type DashboardSummary = {
  appointmentsToday: number;
  availableSlots: number;
  estimatedIncome: number;
  realizedIncome: number;
  cancellations: number;
  noShows: number;
};

export type BookingSuggestion = {
  technicianId: string;
  slots: string[];
};

