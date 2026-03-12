import { getClientById, getServiceById, getTechnicianById, type Booking } from "@nails/core";

const statusMap: Record<Booking["status"], string> = {
  prevista: "accent",
  en_curso: "warning",
  completada: "success",
  cancelada: "warning",
  no_show: "warning"
};

export function AppointmentBoard({ bookings }: Readonly<{ bookings: Booking[] }>) {
  return (
    <div className="timeline-list">
      {bookings.map((booking) => {
        const client = getClientById(booking.clientId);
        const service = getServiceById(booking.serviceId);
        const technician = getTechnicianById(booking.technicianId);
        const date = new Date(booking.start);
        const time = date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

        return (
          <article className="timeline-item" key={booking.id}>
            <div className="row-between">
              <div>
                <strong>
                  {time} · {client?.name}
                </strong>
                <p className="muted">
                  {service?.name} con {technician?.name} · {booking.durationMinutes} min
                </p>
              </div>
              <span className={`tag ${statusMap[booking.status]}`}>{booking.status.replace("_", " ")}</span>
            </div>
            <div className="row-between">
              <span className="tag">{booking.isNewClient ? "Clienta nueva" : "Recurrente"}</span>
              <span className="tag">€{booking.price}</span>
            </div>
            {booking.notes ? <p className="muted">{booking.notes}</p> : null}
          </article>
        );
      })}
    </div>
  );
}

