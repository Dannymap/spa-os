import {
  bookingSuggestions,
  bookings as bookingMocks,
  clients as clientMocks,
  dashboardSummary as dashboardMocks,
  services as serviceMocks,
  type Booking,
  type BookingSuggestion,
  type Client,
  type DashboardSummary,
  type Service
} from "@nails/core";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  if (!apiUrl) {
    return fallback;
  }

  try {
    const response = await fetch(`${apiUrl}${path}`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function getDashboardSummary(): Promise<DashboardSummary> {
  return safeFetch("/api/dashboard", dashboardMocks);
}

export function getBookings(): Promise<Booking[]> {
  return safeFetch("/api/bookings", bookingMocks);
}

export function getClients(): Promise<Client[]> {
  return safeFetch("/api/clients", clientMocks);
}

export function getServices(): Promise<Service[]> {
  return safeFetch("/api/services", serviceMocks);
}

export function getBookingSuggestions(): Promise<BookingSuggestion[]> {
  return Promise.resolve(bookingSuggestions);
}
