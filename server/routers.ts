import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { 
  getEmployeesByCompany, getSalesByCompany, getGoalsByEmployee, getTasksByCompany, 
  getMeetingsByCompany, createCompany, getCompaniesByOwner, getCompanyById, 
  updateUserCompany, createEmployee, createSale, createGoal, createTask, 
  getTimeRecordsByEmployee, createTimeRecord, getEmployeeById, getSaleById, getGoalById, getTaskById
} from "./db";
import { canViewModule, getEmployeeFilterByProfile, getSalesFilterByProfile, getTasksFilterByProfile, UserProfile } from "./permissions";
import { z } from "zod";
import { aiRouter, integrationsRouter } from "./routers-extended";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ ORIZON MODULES ============
  
  // COLABORADORES
  colaboradores: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.companyId) return [];
      const user = ctx.user as any;
      const profile = (user.profile || "operacional") as UserProfile;
      
      if (!canViewModule(profile, "colaboradores")) return [];
      
      const filter = getEmployeeFilterByProfile({
        userId: user.id,
        companyId: user.companyId,
        profile: profile,
        managerId: user.managerId,
        departmentId: user.departmentId,
      });
      
      return getEmployeesByCompany(filter.companyId);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        position: z.string(),
        departmentId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = ctx.user as any;
        if (!user?.companyId) throw new Error("Sem empresa associada");
        
        return createEmployee({
          companyId: user.companyId,
          name: input.name,
          email: input.email,
          position: input.position,
          departmentId: input.departmentId,
          status: "active",
        });
      }),
  }),

  // VENDAS
  vendas: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.companyId) return [];
      const user = ctx.user as any;
      const profile = (user.profile || "operacional") as UserProfile;
      
      if (!canViewModule(profile, "vendas")) return [];
      
      const filter = getSalesFilterByProfile({
        userId: user.id,
        companyId: user.companyId,
        profile: profile,
        managerId: user.managerId,
      });
      
      return getSalesByCompany(filter.companyId);
    }),

    create: protectedProcedure
      .input(z.object({
        clientName: z.string(),
        value: z.string(),
        status: z.enum(["prospect", "negotiation", "closed_won", "closed_lost"]),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = ctx.user as any;
        if (!user?.companyId) throw new Error("Sem empresa associada");
        
        return createSale({
          companyId: user.companyId,
          salesPersonId: user.id,
          clientName: input.clientName,
          value: input.value,
          status: input.status,
        });
      }),
  }),

  // METAS & OKRs
  metas: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) return [];
      const user = ctx.user as any;
      const profile = (user.profile || "operacional") as UserProfile;
      
      if (!canViewModule(profile, "metas")) return [];
      
      if (profile === "operacional") {
        return getGoalsByEmployee(user.id);
      }
      
      if (!user.companyId) return [];
      return [];
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        targetValue: z.string(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = ctx.user as any;
        if (!user?.companyId) throw new Error("Sem empresa associada");
        
        return createGoal({
          companyId: user.companyId,
          employeeId: user.id,
          title: input.title,
          description: input.description,
          targetValue: input.targetValue,
          currentValue: "0",
          status: "in_progress",
          dueDate: input.dueDate,
        });
      }),
  }),

  // TAREFAS & KANBAN
  tarefas: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.companyId) return [];
      const user = ctx.user as any;
      const profile = (user.profile || "operacional") as UserProfile;
      
      if (!canViewModule(profile, "tarefas")) return [];
      
      const filter = getTasksFilterByProfile({
        userId: user.id,
        companyId: user.companyId,
        profile: profile,
      });
      
      return getTasksByCompany(filter.companyId);
    }),

    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        dueDate: z.date().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = ctx.user as any;
        if (!user?.companyId) throw new Error("Sem empresa associada");
        
        return createTask({
          companyId: user.companyId,
          assignedTo: user.id,
          title: input.title,
          description: input.description,
          priority: input.priority || "medium",
          status: "todo",
          dueDate: input.dueDate,
        });
      }),
  }),

  // REUNIÕES & AGENDA
  reunioes: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.companyId) return [];
      const user = ctx.user as any;
      const profile = (user.profile || "operacional") as UserProfile;
      
      if (!canViewModule(profile, "reunioes")) return [];
      
      return getMeetingsByCompany(user.companyId);
    }),
  }),

  // PONTO ELETRÔNICO
  ponto: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const user = ctx.user as any;
      if (!user?.id) return [];
      
      // Operacional vê apenas seus registros
      if (user.profile === "operacional") {
        return getTimeRecordsByEmployee(user.id, user.companyId);
      }
      
      // Outros veem do time
      return [];
    }),

    checkIn: protectedProcedure.mutation(async ({ ctx }) => {
      const user = ctx.user as any;
      if (!user?.companyId) throw new Error("Sem empresa associada");
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return createTimeRecord({
        companyId: user.companyId,
        employeeId: user.id,
        date: today,
        checkIn: new Date(),
        status: "pending",
      });
    }),
  }),

  // IA ASSISTENTE
  ia: aiRouter,
  
  // INTEGRAÇÕES EXTERNAS
  integrations: integrationsRouter,

  // ADMIN - GESTÃO DE EMPRESAS
  admin: router({
    companies: router({
      createWithTestUser: adminProcedure
        .input(z.object({
          companyName: z.string().min(1),
          cnpj: z.string().optional(),
          description: z.string().optional(),
          plan: z.enum(["starter", "professional", "enterprise"]).default("starter"),
        }))
        .mutation(async ({ input, ctx }) => {
          if (!ctx.user) throw new Error("Unauthorized");
          
          const company = await createCompany({
            name: input.companyName,
            cnpj: input.cnpj || null,
            description: input.description || null,
            ownerId: ctx.user.id,
            plan: input.plan,
            status: "active",
          });
          
          if (!company) throw new Error("Failed to create company");
          
          await updateUserCompany(ctx.user.id, company.id);
          
          return {
            company,
            message: `Empresa "${company.name}" criada com sucesso!`,
          };
        }),
      
      list: adminProcedure.query(async ({ ctx }) => {
        if (!ctx.user) return [];
        return getCompaniesByOwner(ctx.user.id);
      }),
      
      getById: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return getCompanyById(input.id);
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
