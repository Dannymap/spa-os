import { DashboardShell } from "../../components/layout/dashboard-shell";
import { ServiceCatalog } from "../../components/services/service-catalog";
import { getServices } from "../../lib/api";

export default async function ConfigPage() {
  const services = await getServices();

  return (
    <DashboardShell
      title="Servicios, precios y recordatorios"
      description="Define el catalogo base del salon y como se comunican las citas."
      activePath="/configuracion"
    >
      <article className="panel-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Catalogo base</span>
            <h3 className="mini-title">Servicios y packs</h3>
          </div>
          <span className="tag accent">Con duracion y precio</span>
        </div>
        <ServiceCatalog services={services} />
      </article>

      <div className="two-col-grid">
        <article className="panel-card">
          <span className="eyebrow">Recordatorios</span>
          <h3 className="mini-title">Mensajes automaticos</h3>
          <div className="compact-list">
            <div className="compact-item">24 h antes por WhatsApp, SMS o email</div>
            <div className="compact-item">3 h antes para bajar cancelaciones de ultima hora</div>
            <div className="compact-item">Plantillas editables con nombre, fecha y tecnica</div>
          </div>
        </article>

        <article className="panel-card">
          <span className="eyebrow">Equipo</span>
          <h3 className="mini-title">Tecnicas y cabinas</h3>
          <div className="compact-list">
            <div className="compact-item">Andrea · Gel y diseno fino · Cabina A</div>
            <div className="compact-item">Lucia · Acrilico y rellenos · Cabina B</div>
            <div className="compact-item">Marta · Pedicura spa · Cabina C</div>
          </div>
        </article>
      </div>
    </DashboardShell>
  );
}

