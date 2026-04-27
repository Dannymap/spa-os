import DashboardShell from "../../components/layout/dashboard-shell";
import { ServicesManager } from "../../components/services/services-manager";
import { WorkersManager } from "../../components/services/workers-manager";
import { ScheduleConfig } from "../../components/services/schedule-config";
import { DayOverrides } from "../../components/services/day-overrides";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const [services, workers] = await Promise.all([
    prisma.service.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] }),
    prisma.worker.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <DashboardShell
      title="Servicios"
      description="Gestiona el catálogo de servicios del salón."
      activePath="/configuracion"
    >
      <ScheduleConfig />
      <DayOverrides />
      <WorkersManager initialWorkers={workers} />
      <ServicesManager initialServices={services} />
    </DashboardShell>
  );
}
