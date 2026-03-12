import { CashSummary } from "../../components/cash/cash-summary";
import { DashboardShell } from "../../components/layout/dashboard-shell";
import { StatCard } from "../../components/ui/stat-card";
import { getBookings, getDashboardSummary } from "../../lib/api";

export default async function CashPage() {
  const [summary, bookings] = await Promise.all([getDashboardSummary(), getBookings()]);

  return (
    <DashboardShell
      title="Caja y cierre del dia"
      description="Control rapido de ingresos, cancelaciones y rendimiento por tecnica."
      activePath="/caja"
    >
      <section className="stats-grid">
        <StatCard label="Ingresos reales" value={`€${summary.realizedIncome}`} hint="Citas ya completadas" />
        <StatCard label="Estimado" value={`€${summary.estimatedIncome}`} hint="Si se mantienen las pendientes" />
        <StatCard label="No show" value={`${summary.noShows}`} hint="Ausencias del dia" />
        <StatCard label="Canceladas" value={`${summary.cancellations}`} hint="Para medir fuga de caja" />
      </section>

      <CashSummary bookings={bookings} />
    </DashboardShell>
  );
}

