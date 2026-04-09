// server/_core/index.ts
import express from "express";
import cookieParser from "cookie-parser" assert { type: "commonjs" };
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "session";
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/cookies.ts
function getSessionCookieOptions(req) {
  const isProduction = process.env.NODE_ENV === "production";
  const protocol = req.protocol || "https";
  const isSecure = isProduction || protocol === "https";
  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: "none",
    path: "/",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  };
}

// server/_core/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: UNAUTHED_ERR_MSG
    });
  }
  return next({
    ctx: {
      user: ctx.user,
      req: ctx.req,
      res: ctx.res
    }
  });
});
var adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: NOT_ADMIN_ERR_MSG
    });
  }
  return next({ ctx });
});

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.query(() => ({
    status: "ok",
    timestamp: /* @__PURE__ */ new Date()
  }))
});

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  profile: mysqlEnum("profile", ["operacional", "tatico", "estrategico", "admin"]).default("operacional"),
  companyId: int("companyId"),
  departmentId: int("departmentId"),
  managerId: int("managerId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 20 }).unique(),
  logo: text("logo"),
  description: text("description"),
  ownerId: int("ownerId").notNull(),
  plan: mysqlEnum("plan", ["starter", "professional", "enterprise"]).default("starter"),
  status: mysqlEnum("status", ["active", "inactive", "suspended"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var departments = mysqlTable("departments", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  managerId: int("managerId"),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  userId: int("userId"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  cpf: varchar("cpf", { length: 20 }).unique(),
  phone: varchar("phone", { length: 20 }),
  position: varchar("position", { length: 255 }),
  departmentId: int("departmentId"),
  managerId: int("managerId"),
  salary: decimal("salary", { precision: 12, scale: 2 }),
  hireDate: timestamp("hireDate"),
  status: mysqlEnum("status", ["active", "inactive", "on_leave", "terminated"]).default("active"),
  avatar: text("avatar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var sales = mysqlTable("sales", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  salesPersonId: int("salesPersonId").notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["prospect", "negotiation", "closed_won", "closed_lost"]).default("prospect"),
  closingDate: timestamp("closingDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var timeRecords = mysqlTable("timeRecords", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  employeeId: int("employeeId").notNull(),
  date: timestamp("date").notNull(),
  checkIn: timestamp("checkIn"),
  checkOut: timestamp("checkOut"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var goals = mysqlTable("goals", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  employeeId: int("employeeId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  targetValue: decimal("targetValue", { precision: 12, scale: 2 }),
  currentValue: decimal("currentValue", { precision: 12, scale: 2 }).default("0"),
  progress: int("progress").default(0),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed", "failed"]).default("not_started"),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var evaluations = mysqlTable("evaluations", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  evaluatedId: int("evaluatedId").notNull(),
  evaluatorId: int("evaluatorId").notNull(),
  score: int("score"),
  feedback: text("feedback"),
  period: varchar("period", { length: 50 }),
  status: mysqlEnum("status", ["draft", "pending", "completed"]).default("draft"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var surveys = mysqlTable("surveys", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["draft", "active", "closed"]).default("draft"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var surveyResponses = mysqlTable("surveyResponses", {
  id: int("id").autoincrement().primaryKey(),
  surveyId: int("surveyId").notNull(),
  employeeId: int("employeeId").notNull(),
  responses: json("responses"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var candidates = mysqlTable("candidates", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  position: varchar("position", { length: 255 }),
  status: mysqlEnum("status", ["applied", "screening", "interview", "offer", "rejected", "hired"]).default("applied"),
  resume: text("resume"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var onboardingTasks = mysqlTable("onboardingTasks", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  employeeId: int("employeeId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("dueDate"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  authorId: int("authorId").notNull(),
  content: text("content").notNull(),
  likes: int("likes").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  authorId: int("authorId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var meetings = mysqlTable("meetings", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  organizerId: int("organizerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  location: varchar("location", { length: 255 }),
  attendees: json("attendees"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  assignedTo: int("assignedTo"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["todo", "in_progress", "review", "done"]).default("todo"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium"),
  dueDate: timestamp("dueDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var healthRecords = mysqlTable("healthRecords", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  employeeId: int("employeeId").notNull(),
  type: varchar("type", { length: 100 }),
  description: text("description"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var vacationRequests = mysqlTable("vacationRequests", {
  id: int("id").autoincrement().primaryKey(),
  companyId: int("companyId").notNull(),
  employeeId: int("employeeId").notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  days: int("days").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  approvedBy: int("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});

// server/_core/env.ts
var ENV = {
  // OAuth
  oauthServerUrl: process.env.OAUTH_SERVER_URL || "",
  viteAppId: process.env.VITE_APP_ID || "",
  jwtSecret: process.env.JWT_SECRET || "",
  // Owner
  ownerOpenId: process.env.OWNER_OPEN_ID || "",
  ownerName: process.env.OWNER_NAME || "",
  // Database
  databaseUrl: process.env.DATABASE_URL || "",
  // AWS S3
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  s3Bucket: process.env.S3_BUCKET || "orizon-saas",
  // APIs
  builtInForgeApiUrl: process.env.BUILT_IN_FORGE_API_URL || "",
  builtInForgeApiKey: process.env.BUILT_IN_FORGE_API_KEY || "",
  viteFrontendForgeApiUrl: process.env.VITE_FRONTEND_FORGE_API_URL || "",
  viteFrontendForgeApiKey: process.env.VITE_FRONTEND_FORGE_API_KEY || ""
};
function validateEnv() {
  const required = [
    "OAUTH_SERVER_URL",
    "VITE_APP_ID",
    "JWT_SECRET",
    "DATABASE_URL"
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`[ENV] Missing required variables: ${missing.join(", ")}`);
  }
}

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getEmployeesByCompany(companyId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(employees).where(eq(employees.companyId, companyId));
}
async function getSalesByCompany(companyId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sales).where(eq(sales.companyId, companyId));
}
async function getGoalsByEmployee(employeeId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(goals).where(eq(goals.employeeId, employeeId));
}
async function getTasksByCompany(companyId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tasks).where(eq(tasks.companyId, companyId));
}
async function getMeetingsByCompany(companyId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(meetings).where(eq(meetings.companyId, companyId));
}
async function createCompany(data) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create company: database not available");
    return null;
  }
  try {
    const result = await db.insert(companies).values(data);
    const companyId = result[0];
    if (companyId) {
      const created = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
      return created.length > 0 ? created[0] : null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create company:", error);
    throw error;
  }
}
async function getCompaniesByOwner(ownerId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(companies).where(eq(companies.ownerId, ownerId));
}
async function getCompanyById(companyId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(companies).where(eq(companies.id, companyId)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function updateUserCompany(userId, companyId) {
  const db = await getDb();
  if (!db) return null;
  try {
    await db.update(users).set({ companyId }).where(eq(users.id, userId));
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update user company:", error);
    throw error;
  }
}
async function getEmployeeById(employeeId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(employees).where(eq(employees.id, employeeId)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function createEmployee(data) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(employees).values(data);
    const employeeId = result[0];
    if (employeeId) {
      return getEmployeeById(employeeId);
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create employee:", error);
    throw error;
  }
}
async function getSaleById(saleId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(sales).where(eq(sales.id, saleId)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function createSale(data) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(sales).values(data);
    const saleId = result[0];
    if (saleId) {
      return getSaleById(saleId);
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create sale:", error);
    throw error;
  }
}
async function getGoalById(goalId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(goals).where(eq(goals.id, goalId)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function createGoal(data) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(goals).values(data);
    const goalId = result[0];
    if (goalId) {
      return getGoalById(goalId);
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create goal:", error);
    throw error;
  }
}
async function getTaskById(taskId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function createTask(data) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(tasks).values(data);
    const taskId = result[0];
    if (taskId) {
      return getTaskById(taskId);
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create task:", error);
    throw error;
  }
}
async function getTimeRecordsByEmployee(employeeId, companyId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(timeRecords).where(
    eq(timeRecords.employeeId, employeeId) && eq(timeRecords.companyId, companyId)
  );
}
async function createTimeRecord(data) {
  const db = await getDb();
  if (!db) return null;
  try {
    const result = await db.insert(timeRecords).values(data);
    const recordId = result[0];
    if (recordId) {
      const record = await db.select().from(timeRecords).where(eq(timeRecords.id, recordId)).limit(1);
      return record.length > 0 ? record[0] : null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create time record:", error);
    throw error;
  }
}

// server/permissions.ts
var viewPermissions = {
  operacional: {
    // Colaborador operacional vê apenas seus dados
    dashboard: true,
    ponto: true,
    // Seus registros
    tarefas: true,
    // Suas tarefas
    metas: true,
    // Suas metas
    avaliacao: true,
    // Sua avaliação
    onboarding: true,
    // Seu onboarding
    feed: true,
    // Feed geral
    reunioes: true,
    // Reuniões que participa
    agenda: true,
    // Sua agenda
    ia: true,
    // IA assistente
    // Não vê
    vendas: false,
    colaboradores: false,
    recrutamento: false,
    clima: false,
    saude: false,
    cultura: false,
    dpdigital: false,
    admin: false
  },
  tatico: {
    // Gestor/RH vê seu time e gestão
    dashboard: true,
    ponto: true,
    // Ponto do seu time
    tarefas: true,
    // Tarefas do seu time
    metas: true,
    // Metas do seu time
    avaliacao: true,
    // Avaliações do seu time
    onboarding: true,
    // Onboarding do seu time
    colaboradores: true,
    // Seu time
    vendas: true,
    // Vendas do seu time
    recrutamento: true,
    // Recrutamento para seu time
    feed: true,
    // Feed geral
    reunioes: true,
    // Reuniões do time
    agenda: true,
    // Agenda do time
    ia: true,
    // IA assistente
    clima: true,
    // Clima do seu time
    treinamentos: true,
    // Treinamentos do time
    // Não vê
    estrategico: false,
    saude: false,
    // Apenas RH vê
    dpdigital: false,
    // Apenas RH vê
    cultura: false,
    // Apenas RH vê
    admin: false
  },
  estrategico: {
    // Diretor/Estratégico vê consolidações
    dashboard: true,
    // Dashboard estratégico
    vendas: true,
    // Consolidado
    colaboradores: true,
    // Visão geral
    metas: true,
    // OKRs estratégicos
    avaliacao: true,
    // Consolidado
    clima: true,
    // Consolidado
    saude: true,
    // Consolidado
    cultura: true,
    // Consolidado
    feed: true,
    // Feed geral
    reunioes: true,
    // Reuniões estratégicas
    agenda: true,
    // Agenda executiva
    ia: true,
    // IA assistente
    // Não vê detalhes operacionais
    ponto: false,
    tarefas: false,
    onboarding: false,
    recrutamento: false,
    treinamentos: false,
    dpdigital: false,
    admin: false
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
    admin: true
  }
};
function canViewModule(profile, module) {
  const permissions = viewPermissions[profile];
  return permissions[module] ?? false;
}
function getEmployeeFilterByProfile(context) {
  switch (context.profile) {
    case "operacional":
      return { companyId: context.companyId };
    case "tatico":
      return {
        companyId: context.companyId,
        managerId: context.userId
      };
    case "estrategico":
      return { companyId: context.companyId };
    case "admin":
      return { companyId: context.companyId };
    default:
      return { companyId: context.companyId };
  }
}
function getSalesFilterByProfile(context) {
  switch (context.profile) {
    case "operacional":
      return {
        companyId: context.companyId,
        salesPersonId: context.userId
      };
    case "tatico":
      return {
        companyId: context.companyId,
        managerId: context.userId
      };
    case "estrategico":
    case "admin":
      return { companyId: context.companyId };
    default:
      return { companyId: context.companyId };
  }
}
function getTasksFilterByProfile(context) {
  switch (context.profile) {
    case "operacional":
      return {
        companyId: context.companyId,
        assignedTo: context.userId
      };
    case "tatico":
      return { companyId: context.companyId };
    case "estrategico":
    case "admin":
      return { companyId: context.companyId };
    default:
      return { companyId: context.companyId };
  }
}

// server/routers.ts
import { z } from "zod";
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // ============ ORIZON MODULES ============
  // COLABORADORES
  colaboradores: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.companyId) return [];
      const user = ctx.user;
      const profile = user.profile || "operacional";
      if (!canViewModule(profile, "colaboradores")) return [];
      const filter = getEmployeeFilterByProfile({
        userId: user.id,
        companyId: user.companyId,
        profile,
        managerId: user.managerId,
        departmentId: user.departmentId
      });
      return getEmployeesByCompany(filter.companyId);
    }),
    create: protectedProcedure.input(z.object({
      name: z.string(),
      email: z.string().email(),
      position: z.string(),
      departmentId: z.number().optional()
    })).mutation(async ({ input, ctx }) => {
      const user = ctx.user;
      if (!user?.companyId) throw new Error("Sem empresa associada");
      return createEmployee({
        companyId: user.companyId,
        name: input.name,
        email: input.email,
        position: input.position,
        departmentId: input.departmentId,
        status: "active"
      });
    })
  }),
  // VENDAS
  vendas: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.companyId) return [];
      const user = ctx.user;
      const profile = user.profile || "operacional";
      if (!canViewModule(profile, "vendas")) return [];
      const filter = getSalesFilterByProfile({
        userId: user.id,
        companyId: user.companyId,
        profile,
        managerId: user.managerId
      });
      return getSalesByCompany(filter.companyId);
    }),
    create: protectedProcedure.input(z.object({
      clientName: z.string(),
      value: z.string(),
      status: z.enum(["prospect", "negotiation", "closed_won", "closed_lost"])
    })).mutation(async ({ input, ctx }) => {
      const user = ctx.user;
      if (!user?.companyId) throw new Error("Sem empresa associada");
      return createSale({
        companyId: user.companyId,
        salesPersonId: user.id,
        clientName: input.clientName,
        value: input.value,
        status: input.status
      });
    })
  }),
  // METAS & OKRs
  metas: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.id) return [];
      const user = ctx.user;
      const profile = user.profile || "operacional";
      if (!canViewModule(profile, "metas")) return [];
      if (profile === "operacional") {
        return getGoalsByEmployee(user.id);
      }
      if (!user.companyId) return [];
      return [];
    }),
    create: protectedProcedure.input(z.object({
      title: z.string(),
      description: z.string().optional(),
      targetValue: z.string(),
      dueDate: z.date().optional()
    })).mutation(async ({ input, ctx }) => {
      const user = ctx.user;
      if (!user?.companyId) throw new Error("Sem empresa associada");
      return createGoal({
        companyId: user.companyId,
        employeeId: user.id,
        title: input.title,
        description: input.description,
        targetValue: input.targetValue,
        currentValue: "0",
        status: "in_progress",
        dueDate: input.dueDate
      });
    })
  }),
  // TAREFAS & KANBAN
  tarefas: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.companyId) return [];
      const user = ctx.user;
      const profile = user.profile || "operacional";
      if (!canViewModule(profile, "tarefas")) return [];
      const filter = getTasksFilterByProfile({
        userId: user.id,
        companyId: user.companyId,
        profile
      });
      return getTasksByCompany(filter.companyId);
    }),
    create: protectedProcedure.input(z.object({
      title: z.string(),
      description: z.string().optional(),
      priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
      dueDate: z.date().optional()
    })).mutation(async ({ input, ctx }) => {
      const user = ctx.user;
      if (!user?.companyId) throw new Error("Sem empresa associada");
      return createTask({
        companyId: user.companyId,
        assignedTo: user.id,
        title: input.title,
        description: input.description,
        priority: input.priority || "medium",
        status: "todo",
        dueDate: input.dueDate
      });
    })
  }),
  // REUNIÕES & AGENDA
  reunioes: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user?.companyId) return [];
      const user = ctx.user;
      const profile = user.profile || "operacional";
      if (!canViewModule(profile, "reunioes")) return [];
      return getMeetingsByCompany(user.companyId);
    })
  }),
  // PONTO ELETRÔNICO
  ponto: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const user = ctx.user;
      if (!user?.id) return [];
      if (user.profile === "operacional") {
        return getTimeRecordsByEmployee(user.id, user.companyId);
      }
      return [];
    }),
    checkIn: protectedProcedure.mutation(async ({ ctx }) => {
      const user = ctx.user;
      if (!user?.companyId) throw new Error("Sem empresa associada");
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      return createTimeRecord({
        companyId: user.companyId,
        employeeId: user.id,
        date: today,
        checkIn: /* @__PURE__ */ new Date(),
        status: "pending"
      });
    })
  }),
  // IA ASSISTENTE
  ia: router({
    chat: protectedProcedure.input(z.object({ message: z.string() })).mutation(async ({ input, ctx }) => {
      const user = ctx.user;
      const profile = user.profile || "operacional";
      if (!canViewModule(profile, "ia")) {
        throw new Error("Voc\xEA n\xE3o tem permiss\xE3o para usar a IA");
      }
      return {
        response: `Resposta da IA para: ${input.message}`,
        timestamp: /* @__PURE__ */ new Date()
      };
    })
  }),
  // ADMIN - GESTÃO DE EMPRESAS
  admin: router({
    companies: router({
      createWithTestUser: adminProcedure.input(z.object({
        companyName: z.string().min(1),
        cnpj: z.string().optional(),
        description: z.string().optional(),
        plan: z.enum(["starter", "professional", "enterprise"]).default("starter")
      })).mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Unauthorized");
        const company = await createCompany({
          name: input.companyName,
          cnpj: input.cnpj || null,
          description: input.description || null,
          ownerId: ctx.user.id,
          plan: input.plan,
          status: "active"
        });
        if (!company) throw new Error("Failed to create company");
        await updateUserCompany(ctx.user.id, company.id);
        return {
          company,
          message: `Empresa "${company.name}" criada com sucesso!`
        };
      }),
      list: adminProcedure.query(async ({ ctx }) => {
        if (!ctx.user) return [];
        return getCompaniesByOwner(ctx.user.id);
      }),
      getById: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
        return getCompanyById(input.id);
      })
    })
  })
});

// server/_core/context.ts
import { jwtVerify } from "jose";
async function createContext(req, res) {
  const sessionToken = req.cookies[COOKIE_NAME];
  let user = null;
  if (sessionToken) {
    try {
      const secret = new TextEncoder().encode(ENV.jwtSecret);
      const verified = await jwtVerify(sessionToken, secret);
      const openId = verified.payload.openId;
      if (openId) {
        user = await getUserByOpenId(openId);
      }
    } catch (error) {
      console.warn("[Context] JWT verification failed:", error);
    }
  }
  return {
    user,
    req,
    res
  };
}

// server/_core/index.ts
validateEnv();
var app = express();
var port = process.env.PORT || 3e3;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: async (opts) => createContext(opts.req, opts.res)
  })
);
app.use(express.static("client/dist"));
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile("client/dist/index.html", { root: "." });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: /* @__PURE__ */ new Date() });
});
app.listen(port, () => {
  console.log(`[Server] ORIZON SaaS running on port ${port}`);
});
