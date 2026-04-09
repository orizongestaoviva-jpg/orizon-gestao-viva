/**
 * ORIZON — Sistema de Permissões por Hierarquia
 * Define o que cada perfil pode ver e fazer
 */

export type UserProfile = "operacional" | "tatico" | "estrategico" | "admin";

export interface PermissionContext {
  userId: number;
  companyId: number;
  profile: UserProfile;
  managerId?: number; // Para gestores
  departmentId?: number; // Para filtrar por departamento
}

/**
 * Regras de visualização por perfil
 */
export const viewPermissions = {
  operacional: {
    // Colaborador operacional vê apenas seus dados
    dashboard: true,
    ponto: true, // Seus registros
    tarefas: true, // Suas tarefas
    metas: true, // Suas metas
    avaliacao: true, // Sua avaliação
    onboarding: true, // Seu onboarding
    feed: true, // Feed geral
    reunioes: true, // Reuniões que participa
    agenda: true, // Sua agenda
    ia: true, // IA assistente
    // Não vê
    vendas: false,
    colaboradores: false,
    recrutamento: false,
    clima: false,
    saude: false,
    cultura: false,
    dpdigital: false,
    admin: false,
  },

  tatico: {
    // Gestor/RH vê seu time e gestão
    dashboard: true,
    ponto: true, // Ponto do seu time
    tarefas: true, // Tarefas do seu time
    metas: true, // Metas do seu time
    avaliacao: true, // Avaliações do seu time
    onboarding: true, // Onboarding do seu time
    colaboradores: true, // Seu time
    vendas: true, // Vendas do seu time
    recrutamento: true, // Recrutamento para seu time
    feed: true, // Feed geral
    reunioes: true, // Reuniões do time
    agenda: true, // Agenda do time
    ia: true, // IA assistente
    clima: true, // Clima do seu time
    treinamentos: true, // Treinamentos do time
    // Não vê
    estrategico: false,
    saude: false, // Apenas RH vê
    dpdigital: false, // Apenas RH vê
    cultura: false, // Apenas RH vê
    admin: false,
  },

  estrategico: {
    // Diretor/Estratégico vê consolidações
    dashboard: true, // Dashboard estratégico
    vendas: true, // Consolidado
    colaboradores: true, // Visão geral
    metas: true, // OKRs estratégicos
    avaliacao: true, // Consolidado
    clima: true, // Consolidado
    saude: true, // Consolidado
    cultura: true, // Consolidado
    feed: true, // Feed geral
    reunioes: true, // Reuniões estratégicas
    agenda: true, // Agenda executiva
    ia: true, // IA assistente
    // Não vê detalhes operacionais
    ponto: false,
    tarefas: false,
    onboarding: false,
    recrutamento: false,
    treinamentos: false,
    dpdigital: false,
    admin: false,
  },

  admin: {
    // Admin Master vê TUDO
    dashboard: true,
    ponto: true,
    tarefas: true,
    metas: true,
    avaliacao: true,
    onboarding: true,
    colaboradores: true,
    vendas: true,
    recrutamento: true,
    feed: true,
    reunioes: true,
    agenda: true,
    ia: true,
    clima: true,
    treinamentos: true,
    saude: true,
    dpdigital: true,
    cultura: true,
    admin: true,
  },
};

/**
 * Determina quais dados um usuário pode ver
 */
export function canViewModule(profile: UserProfile, module: string): boolean {
  const permissions = viewPermissions[profile] as Record<string, boolean>;
  return permissions[module] ?? false;
}

/**
 * Filtra colaboradores baseado na hierarquia
 */
export function getEmployeeFilterByProfile(context: PermissionContext): {
  companyId: number;
  managerId?: number;
  departmentId?: number;
} {
  switch (context.profile) {
    case "operacional":
      // Vê apenas a si mesmo (será filtrado no frontend)
      return { companyId: context.companyId };
    
    case "tatico":
      // Vê seu time (onde ele é gestor)
      return {
        companyId: context.companyId,
        managerId: context.userId,
      };
    
    case "estrategico":
      // Vê todos da empresa
      return { companyId: context.companyId };
    
    case "admin":
      // Vê todos
      return { companyId: context.companyId };
    
    default:
      return { companyId: context.companyId };
  }
}

/**
 * Filtra vendas baseado na hierarquia
 */
export function getSalesFilterByProfile(context: PermissionContext): {
  companyId: number;
  salesPersonId?: number;
  managerId?: number;
} {
  switch (context.profile) {
    case "operacional":
      // Vê apenas suas vendas
      return {
        companyId: context.companyId,
        salesPersonId: context.userId,
      };
    
    case "tatico":
      // Vê vendas do seu time
      return {
        companyId: context.companyId,
        managerId: context.userId,
      };
    
    case "estrategico":
    case "admin":
      // Vê todas
      return { companyId: context.companyId };
    
    default:
      return { companyId: context.companyId };
  }
}

/**
 * Filtra tarefas baseado na hierarquia
 */
export function getTasksFilterByProfile(context: PermissionContext): {
  companyId: number;
  assignedTo?: number;
} {
  switch (context.profile) {
    case "operacional":
      // Vê apenas suas tarefas
      return {
        companyId: context.companyId,
        assignedTo: context.userId,
      };
    
    case "tatico":
      // Vê tarefas do seu time (será filtrado por manager)
      return { companyId: context.companyId };
    
    case "estrategico":
    case "admin":
      // Vê todas
      return { companyId: context.companyId };
    
    default:
      return { companyId: context.companyId };
  }
}

/**
 * Valida se usuário pode acessar um recurso específico
 */
export function canAccessResource(
  context: PermissionContext,
  resourceType: string,
  resourceOwnerId?: number
): boolean {
  // Admin vê tudo
  if (context.profile === "admin") return true;

  // Se é recurso do próprio usuário
  if (resourceOwnerId === context.userId) return true;

  // Tático pode ver recursos do seu time (será validado com managerId)
  if (context.profile === "tatico" && resourceOwnerId === context.managerId) {
    return true;
  }

  // Estratégico pode ver recursos da empresa
  if (context.profile === "estrategico") return true;

  return false;
}
