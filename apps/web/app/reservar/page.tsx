import { DashboardShell } from "../../components/layout/dashboard-shell";
import { BookingFlow } from "../../components/bookings/booking-flow";
import { getBookingSuggestions, getServices } from "../../lib/api";

export default async function BookingPage() {
  const [services, suggestions] = await Promise.all([getServices(), getBookingSuggestions()]);

  return (
    <DashboardShell
      title="Reserva online para clientas"
      description="Vista publica pensada para Instagram, WhatsApp o QR del salon."
      activePath="/reservar"
    >
      <BookingFlow services={services} suggestions={suggestions} />
    </DashboardShell>
  );
}
