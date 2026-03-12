import { getTechnicianById, type BookingSuggestion, type Service } from "@nails/core";

export function BookingFlow({
  services,
  suggestions
}: Readonly<{
  services: Service[];
  suggestions: BookingSuggestion[];
}>) {
  const featured = services.slice(0, 3);

  return (
    <div className="booking-steps">
      <article className="panel-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Paso a paso</span>
            <h3 className="mini-title">Reserva online en 4 pasos</h3>
          </div>
          <span className="tag accent">24/7</span>
        </div>
        <div className="three-col-grid">
          {[
            "Elige servicio o pack con duracion visible",
            "Selecciona tecnica o deja que el sistema asigne la mejor opcion",
            "Escoge hueco libre y confirma con nombre y movil"
          ].map((step, index) => (
            <div className="step-card" key={step}>
              <div className="step-index">{index + 1}</div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="panel-card">
        <span className="eyebrow">Servicios destacados</span>
        <div className="compact-list">
          {featured.map((service) => (
            <div className="compact-item row-between" key={service.id}>
              <div>
                <strong>{service.name}</strong>
                <p className="muted">{service.durationMinutes} min</p>
              </div>
              <span className="tag">€{service.price}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="panel-card">
        <span className="eyebrow">Huecos sugeridos</span>
        <div className="compact-list">
          {suggestions.map((suggestion) => (
            <div className="compact-item" key={suggestion.technicianId}>
              <div className="row-between">
                <strong>{getTechnicianById(suggestion.technicianId)?.name}</strong>
                <span className="tag warning">{suggestion.slots.length} huecos</span>
              </div>
              <p className="muted">{suggestion.slots.join(" · ")}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

