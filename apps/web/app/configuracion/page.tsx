import DashboardShell from "../../components/layout/dashboard-shell";
import { ServicesManager } from "../../components/services/services-manager";
import { ScheduleConfig } from "../../components/services/schedule-config";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return (
    <DashboardShell
      title="Servicios"
      description="Gestiona el catálogo de servicios del salón."
      activePath="/configuracion"
    >
      <ScheduleConfig />
      <ServicesManager initialServices={services} />
    </DashboardShell>
  );
}
