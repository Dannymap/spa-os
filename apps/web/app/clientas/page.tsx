import { ClientList } from "../../components/clients/client-list";
import { DashboardShell } from "../../components/layout/dashboard-shell";
import { StatCard } from "../../components/ui/stat-card";
import { getClients } from "../../lib/api";

export default async function ClientsPage() {
  const clients = await getClients();
  const vipCount = clients.filter((client) => client.vip).length;

  return (
    <DashboardShell
      title="Gestion de clientas"
      description="Historial visual, preferencias y reservas directas desde cada ficha."
      activePath="/clientas"
    >
      <section className="stats-grid">
        <StatCard label="Total clientas" value={`${clients.length}`} hint="Base actual del MVP" />
        <StatCard label="VIP" value={`${vipCount}`} hint="Las que mas repiten o gastan" />
        <StatCard
          label="Con alergias"
          value={`${clients.filter((client) => client.allergies.length > 0).length}`}
          hint="Importante antes de cerrar cita"
        />
        <StatCard label="Ultima visita" value={clients[0]?.lastVisit ?? "-"} hint="Cliente mas reciente" />
      </section>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Fichas visuales</span>
            <h3 className="mini-title">Clientas y preferencias</h3>
          </div>
          <span className="tag">Busqueda por nombre o movil</span>
        </div>
        <ClientList clients={clients} />
      </article>
    </DashboardShell>
  );
}

