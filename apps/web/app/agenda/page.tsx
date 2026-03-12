import { AppointmentBoard } from "../../components/agenda/appointment-board";
import { DashboardShell } from "../../components/layout/dashboard-shell";
import { StatCard } from "../../components/ui/stat-card";
import { getBookings, getDashboardSummary } from "../../lib/api";

export default async function AgendaPage() {
  const [summary, bookings] = await Promise.all([getDashboardSummary(), getBookings()]);

  return (
    <DashboardShell
      title="Agenda por tecnica"
      description="Organiza el dia por cabina, controla estados y rellena huecos sin salir del panel."
      activePath="/agenda"
    >
      <section className="stats-grid">
        <StatCard label="Citas hoy" value={`${summary.appointmentsToday}`} hint="Vista rapida del dia" />
        <StatCard label="Huecos libres" value={`${summary.availableSlots}`} hint="Espacios listos para vender" />
        <StatCard label="Estimado" value={`€${summary.estimatedIncome}`} hint="Ingresos si todo se confirma" />
        <StatCard label="Cancelaciones" value={`${summary.cancellations}`} hint="Incluye anulaciones del dia" />
      </section>

      <article className="panel-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Vista hoy</span>
            <h3 className="mini-title">Citas del salon</h3>
          </div>
          <span className="tag accent">Reordenar, mover y cerrar</span>
        </div>
        <AppointmentBoard bookings={bookings} />
      </article>
    </DashboardShell>
  );
}

