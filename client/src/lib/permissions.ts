/**
 * ORIZON — Gestão Viva
 * permissions.ts: Sistema de controle de acesso e permissões por perfil
 * Define quais módulos, dados e funcionalidades cada perfil pode acessar
 */

import { UserRole } from "@/contexts/AuthContext";

export interface ModuleAccess {
  visible: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canExport?: boolean;
  canApprove?: boolean;
}

export interface RolePermissions {
  modules: Record<string, ModuleAccess>;
  dashboardType: "operacional" | "tatico" | "rh" | "estrategico" | "admin";
  canViewOtherTeams: boolean;
  canViewFinancials: boolean;
  canManageUsers: boolean;
  canManagePermissions: boolean;
  canAccessAdmin: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  operacional: {
    modules: {
      dashboard: { visible: true },
      feed: { visible: true },
      notificacoes: { visible: true },
      colaboradores: { visible: false },
      recrutamento: { visible: false },
      onboarding: { visible: false },
      treinamentos: { visible: true, canCreate: false },
      ponto: { visible: true, canCreate: true, canEdit: true },
      "dp-digital": { visible: true },
      agenda: { visible: true, canCreate: true },
      kanban: { visible: true, canCreate: true, canEdit: true },
      vendas: { visible: true },
      metas: { visible: true },
      avaliacao: { visible: true },
      clima: { visible: true },
      saude: { visible: true },
      cultura: { visible: true },
      reunioes: { visible: true, canCreate: true },
      ia: { visible: true },
      admin: { visible: false },
      seguranca: { visible: false },
      configuracoes: { visible: false },
    },
    dashboardType: "operacional",
    canViewOtherTeams: false,
    canViewFinancials: false,
    canManageUsers: false,
    canManagePermissions: false,
    canAccessAdmin: false,
  },

  tatico: {
    modules: {
      dashboard: { visible: true },
      feed: { visible: true },
      notificacoes: { visible: true },
      colaboradores: { visible: true, canEdit: false },
      recrutamento: { visible: true, canCreate: true, canEdit: true },
      onboarding: { visible: true, canCreate: true, canEdit: true },
      treinamentos: { visible: true, canCreate: true, canEdit: true },
      ponto: { visible: true, canApprove: true },
      "dp-digital": { visible: true, canApprove: true },
      agenda: { visible: true, canCreate: true, canEdit: true },
      kanban: { visible: true, canCreate: true, canEdit: true },
      vendas: { visible: true, canExport: true },
      metas: { visible: true, canCreate: true, canEdit: true },
      avaliacao: { visible: true, canCreate: true, canEdit: true },
      clima: { visible: true, canCreate: true },
      saude: { visible: true },
      cultura: { visible: true },
      reunioes: { visible: true, canCreate: true },
      ia: { visible: true },
      admin: { visible: false },
      seguranca: { visible: false },
      configuracoes: { visible: true },
    },
    dashboardType: "tatico",
    canViewOtherTeams: true,
    canViewFinancials: true,
    canManageUsers: false,
    canManagePermissions: false,
    canAccessAdmin: false,
  },

  estrategico: {
    modules: {
      dashboard: { visible: true },
      feed: { visible: true },
      notificacoes: { visible: true },
      colaboradores: { visible: true, canEdit: false },
      recrutamento: { visible: true, canEdit: false },
      onboarding: { visible: true, canEdit: false },
      treinamentos: { visible: true, canEdit: false },
      ponto: { visible: true },
      "dp-digital": { visible: true },
      agenda: { visible: true },
      kanban: { visible: true },
      vendas: { visible: true, canExport: true },
      metas: { visible: true, canExport: true },
      avaliacao: { visible: true, canExport: true },
      clima: { visible: true, canExport: true },
      saude: { visible: true },
      cultura: { visible: true },
      reunioes: { visible: true },
      ia: { visible: true },
      admin: { visible: false },
      seguranca: { visible: false },
      configuracoes: { visible: false },
    },
    dashboardType: "estrategico",
    canViewOtherTeams: true,
    canViewFinancials: true,
    canManageUsers: false,
    canManagePermissions: false,
    canAccessAdmin: false,
  },

  admin: {
    modules: {
      dashboard: { visible: true },
      feed: { visible: false },
      notificacoes: { visible: false },
      colaboradores: { visible: false },
      recrutamento: { visible: false },
      onboarding: { visible: false },
      treinamentos: { visible: false },
      ponto: { visible: false },
      "dp-digital": { visible: false },
      agenda: { visible: false },
      kanban: { visible: false },
      vendas: { visible: false },
      metas: { visible: false },
      avaliacao: { visible: false },
      clima: { visible: false },
      saude: { visible: false },
      cultura: { visible: false },
      reunioes: { visible: false },
      ia: { visible: false },
      admin: { visible: true },
      seguranca: { visible: true },
      configuracoes: { visible: true },
    },
    dashboardType: "admin",
    canViewOtherTeams: true,
    canViewFinancials: true,
    canManageUsers: true,
    canManagePermissions: true,
    canAccessAdmin: true,
  },
};

export function getModuleAccess(role: UserRole, module: string): ModuleAccess {
  const permissions = rolePermissions[role];
  return permissions.modules[module] || { visible: false };
}

export function canAccessModule(role: UserRole, module: string): boolean {
  return getModuleAccess(role, module).visible;
}

export function getDashboardType(role: UserRole): RolePermissions["dashboardType"] {
  return rolePermissions[role].dashboardType;
}
