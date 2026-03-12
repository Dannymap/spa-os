import { getServiceById, getTechnicianById, type Booking } from "@nails/core";

export function CashSummary({ bookings }: Readonly<{ bookings: Booking[] }>) {
  const completed = bookings.filter((booking) => booking.status === "completada");
  const byTechnician = new Map<string, number>();
  const byService = new Map<string, number>();

  for (const booking of completed) {
    byTechnician.set(booking.technicianId, (byTechnician.get(booking.technicianId) ?? 0) + booking.price);
    byService.set(booking.serviceId, (byService.get(booking.serviceId) ?? 0) + booking.price);
  }

  return (
    <div className="two-col-grid">
      <article className="panel-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Ingresos por tecnica</span>
            <h3 className="mini-title">Caja por profesional</h3>
          </div>
          <span className="tag success">Citas cerradas</span>
        </div>
        <div className="compact-list">
          {[...byTechnician.entries()].map(([technicianId, total]) => (
            <div className="compact-item row-between" key={technicianId}>
              <strong>{getTechnicianById(technicianId)?.name}</strong>
              <span>€{total}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Servicios top</span>
            <h3 className="mini-title">Lo que mejor vende hoy</h3>
          </div>
          <span className="tag accent">Filtro hoy</span>
        </div>
        <div className="compact-list">
          {[...byService.entries()].map(([serviceId, total]) => (
            <div className="compact-item row-between" key={serviceId}>
              <strong>{getServiceById(serviceId)?.name}</strong>
              <span>€{total}</span>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

