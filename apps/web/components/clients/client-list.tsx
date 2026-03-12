import type { Client } from "@nails/core";

export function ClientList({ clients }: Readonly<{ clients: Client[] }>) {
  return (
    <div className="timeline-list">
      {clients.map((client) => (
        <article className="timeline-item" key={client.id}>
          <div className="row-between">
            <div>
              <strong>{client.name}</strong>
              <p className="muted">{client.phone}</p>
            </div>
            <span className={`tag ${client.vip ? "accent" : ""}`}>{client.vip ? "VIP" : `${client.visits} visitas`}</span>
          </div>
          <p className="muted">
            Forma habitual: {client.usualShape} · Largo: {client.usualLength}
          </p>
          <p className="muted">Colores favoritos: {client.favoriteColors.join(", ")}</p>
          <div className="row-between">
            <span className="tag">Ultima visita: {client.lastVisit}</span>
            <span className="tag">{client.allergies.length ? `Alergias: ${client.allergies.join(", ")}` : "Sin alergias"}</span>
          </div>
          {client.lastPhotos[0] ? (
            <img className="client-photo" src={client.lastPhotos[0]} alt={`Trabajo reciente de ${client.name}`} />
          ) : null}
        </article>
      ))}
    </div>
  );
}

