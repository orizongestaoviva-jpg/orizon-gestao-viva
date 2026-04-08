/**
 * ORIZON — Gestão Viva
 * Dashboard Page — Visões customizadas por perfil hierárquico
 * Operacional, Tático, RH, Estratégico e Admin Master
 */

import { useAuth } from "@/contexts/AuthContext";
import { getDashboardType } from "@/lib/permissions";
import DashboardOperacional from "@/components/dashboards/DashboardOperacional";
import DashboardTatico from "@/components/dashboards/DashboardTatico";
import DashboardEstrategico from "@/components/dashboards/DashboardEstrategico";
import DashboardAdmin from "@/components/dashboards/DashboardAdmin";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const dashboardType = getDashboardType(user.role);

  switch (dashboardType) {
    case "operacional":
      return <DashboardOperacional />;
    case "tatico":
      return <DashboardTatico />;
    case "estrategico":
      return <DashboardEstrategico />;
    case "admin":
      return <DashboardAdmin />;
    default:
      return <DashboardTatico />;
  }
}
