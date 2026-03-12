import type { Service } from "@nails/core";

export function ServiceCatalog({ services }: Readonly<{ services: Service[] }>) {
  return (
    <div className="service-grid">
      {services.map((service) => (
        <article className="panel-card" key={service.id}>
          <span className="eyebrow">{service.category}</span>
          <h3 className="mini-title">{service.name}</h3>
          <p className="muted">{service.durationMinutes} min · €{service.price}</p>
          <span className={`tag ${service.allowsDesignExtra ? "accent" : ""}`}>
            {service.allowsDesignExtra ? "Permite extra de diseno" : "Sin extras"}
          </span>
        </article>
      ))}
    </div>
  );
}

