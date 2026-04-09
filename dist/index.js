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
import { z as z2 } from "zod";

// server/routers-extended.ts
import { z } from "zod";

// server/_core/llm.ts
async function invokeLLM(options) {
  try {
    const response = await fetch(`${ENV.builtInForgeApiUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.builtInForgeApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2e3
      })
    });
    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      choices: [
        {
          message: {
            content: data.choices[0]?.message?.content || "Sem resposta"
          }
        }
      ]
    };
  } catch (error) {
    console.error("[LLM] Error:", error);
    return {
      choices: [
        {
          message: {
            content: "Desculpe, houve um erro ao processar sua solicita\xE7\xE3o."
          }
        }
      ]
    };
  }
}

// server/_core/ai.ts
async function analyzeClimate(surveys2) {
  const prompt = `Analise os seguintes dados de clima organizacional e forne\xE7a insights:
${JSON.stringify(surveys2, null, 2)}

Forne\xE7a:
1. Pontua\xE7\xE3o geral de clima (0-100)
2. Principais pontos positivos
3. \xC1reas cr\xEDticas de melhoria
4. Recomenda\xE7\xF5es acion\xE1veis
5. Risco de turnover (baixo/m\xE9dio/alto)`;
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Voc\xEA \xE9 um especialista em clima organizacional e gest\xE3o de pessoas. Analise dados de pesquisas de clima e forne\xE7a insights profundos e acion\xE1veis."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });
  return response.choices[0]?.message.content || "";
}
async function analyzePerformance(performanceData) {
  const prompt = `Analise os seguintes dados de performance:
${JSON.stringify(performanceData, null, 2)}

Forne\xE7a:
1. Avalia\xE7\xE3o geral de performance (0-100)
2. Top performers
3. Colaboradores que precisam de suporte
4. Tend\xEAncias de performance
5. Recomenda\xE7\xF5es de desenvolvimento`;
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Voc\xEA \xE9 um especialista em gest\xE3o de performance. Analise dados de performance e forne\xE7a insights para melhorar resultados."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });
  return response.choices[0]?.message.content || "";
}
async function detectBurnoutRisk(employeeData) {
  const prompt = `Analise o seguinte perfil de colaborador para detectar risco de burnout:
${JSON.stringify(employeeData, null, 2)}

Forne\xE7a:
1. N\xEDvel de risco de burnout (baixo/m\xE9dio/alto/cr\xEDtico)
2. Sinais de alerta identificados
3. Fatores contribuintes
4. Recomenda\xE7\xF5es de interven\xE7\xE3o
5. A\xE7\xF5es imediatas necess\xE1rias`;
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Voc\xEA \xE9 um especialista em sa\xFAde ocupacional e bem-estar. Identifique riscos de burnout e recomende interven\xE7\xF5es."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });
  return response.choices[0]?.message.content || "";
}
async function generateRecommendations(companyData) {
  const prompt = `Com base nos seguintes dados da empresa, gere recomenda\xE7\xF5es estrat\xE9gicas:
${JSON.stringify(companyData, null, 2)}

Forne\xE7a:
1. Recomenda\xE7\xF5es de curto prazo (1-3 meses)
2. Recomenda\xE7\xF5es de m\xE9dio prazo (3-6 meses)
3. Recomenda\xE7\xF5es de longo prazo (6-12 meses)
4. M\xE9tricas de sucesso
5. Pr\xF3ximos passos`;
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Voc\xEA \xE9 um consultor estrat\xE9gico de gest\xE3o de pessoas. Gere recomenda\xE7\xF5es baseadas em dados."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });
  return response.choices[0]?.message.content || "";
}

// server/storage.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
var s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: ENV.awsAccessKeyId,
    secretAccessKey: ENV.awsSecretAccessKey
  }
});
async function storagePut(key, data, contentType) {
  const command = new PutObjectCommand({
    Bucket: ENV.s3Bucket,
    Key: key,
    Body: data,
    ContentType: contentType || "application/octet-stream"
  });
  await s3Client.send(command);
  const url = `https://${ENV.s3Bucket}.s3.amazonaws.com/${key}`;
  return { url, key };
}

// server/_core/integrations.ts
async function sendEmailViaGmail(to, subject, body) {
  try {
    const response = await fetch("https://www.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GMAIL_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        raw: Buffer.from(
          `To: ${to}
Subject: ${subject}

${body}`
        ).toString("base64")
      })
    });
    if (!response.ok) {
      throw new Error("Failed to send email via Gmail");
    }
    return { success: true, messageId: (await response.json()).id };
  } catch (error) {
    console.error("[Gmail] Error sending email:", error);
    return { success: false, error: String(error) };
  }
}
async function sendEmailViaOutlook(to, subject, body) {
  try {
    const response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OUTLOOK_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: {
          subject,
          body: { contentType: "HTML", content: body },
          toRecipients: [{ emailAddress: { address: to } }]
        }
      })
    });
    if (!response.ok) {
      throw new Error("Failed to send email via Outlook");
    }
    return { success: true };
  } catch (error) {
    console.error("[Outlook] Error sending email:", error);
    return { success: false, error: String(error) };
  }
}
async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    const response = await fetch(
      `https://graph.instagram.com/v18.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phoneNumber,
          type: "text",
          text: { body: message }
        })
      }
    );
    if (!response.ok) {
      throw new Error("Failed to send WhatsApp message");
    }
    return { success: true, messageId: (await response.json()).messages[0].id };
  } catch (error) {
    console.error("[WhatsApp] Error sending message:", error);
    return { success: false, error: String(error) };
  }
}
async function uploadFileToS3(filename, fileBuffer, mimeType) {
  try {
    const key = `uploads/${Date.now()}-${filename}`;
    const result = await storagePut(key, fileBuffer, mimeType);
    return { success: true, url: result.url, key: result.key };
  } catch (error) {
    console.error("[S3] Error uploading file:", error);
    return { success: false, error: String(error) };
  }
}
async function initiateWebRTCCall(initiatorId, recipientId) {
  try {
    return {
      success: true,
      callId: `call-${Date.now()}`,
      signalingServer: process.env.SIGNALING_SERVER_URL,
      stunServers: process.env.STUN_SERVERS?.split(",") || [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302"
      ]
    };
  } catch (error) {
    console.error("[WebRTC] Error initiating call:", error);
    return { success: false, error: String(error) };
  }
}

// server/routers-extended.ts
var aiRouter = router({
  analyzeClimate: protectedProcedure.input(z.object({ surveyData: z.array(z.any()) })).mutation(async ({ input }) => {
    const analysis = await analyzeClimate(input.surveyData);
    return { success: true, analysis };
  }),
  analyzePerformance: protectedProcedure.input(z.object({ performanceData: z.array(z.any()) })).mutation(async ({ input }) => {
    const analysis = await analyzePerformance(input.performanceData);
    return { success: true, analysis };
  }),
  detectBurnout: protectedProcedure.input(z.object({ employeeData: z.any() })).mutation(async ({ input }) => {
    const analysis = await detectBurnoutRisk(input.employeeData);
    return { success: true, analysis };
  }),
  generateRecommendations: protectedProcedure.input(z.object({ companyData: z.any() })).mutation(async ({ input }) => {
    const recommendations = await generateRecommendations(input.companyData);
    return { success: true, recommendations };
  })
});
var integrationsRouter = router({
  sendEmailGmail: protectedProcedure.input(z.object({ to: z.string().email(), subject: z.string(), body: z.string() })).mutation(async ({ input }) => {
    const result = await sendEmailViaGmail(input.to, input.subject, input.body);
    return result;
  }),
  sendEmailOutlook: protectedProcedure.input(z.object({ to: z.string().email(), subject: z.string(), body: z.string() })).mutation(async ({ input }) => {
    const result = await sendEmailViaOutlook(input.to, input.subject, input.body);
    return result;
  }),
  sendWhatsApp: protectedProcedure.input(z.object({ phoneNumber: z.string(), message: z.string() })).mutation(async ({ input }) => {
    const result = await sendWhatsAppMessage(input.phoneNumber, input.message);
    return result;
  }),
  uploadFileS3: protectedProcedure.input(z.object({ filename: z.string(), mimeType: z.string(), fileBuffer: z.any() })).mutation(async ({ input }) => {
    const result = await uploadFileToS3(input.filename, input.fileBuffer, input.mimeType);
    return result;
  }),
  initiateCall: protectedProcedure.input(z.object({ recipientId: z.string() })).mutation(async ({ input, ctx }) => {
    const result = await initiateWebRTCCall(ctx.user.id, input.recipientId);
    return result;
  })
});
var extendedRouter = router({
  ai: aiRouter,
  integrations: integrationsRouter
});

// server/routers.ts
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
    create: protectedProcedure.input(z2.object({
      name: z2.string(),
      email: z2.string().email(),
      position: z2.string(),
      departmentId: z2.number().optional()
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
    create: protectedProcedure.input(z2.object({
      clientName: z2.string(),
      value: z2.string(),
      status: z2.enum(["prospect", "negotiation", "closed_won", "closed_lost"])
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
    create: protectedProcedure.input(z2.object({
      title: z2.string(),
      description: z2.string().optional(),
      targetValue: z2.string(),
      dueDate: z2.date().optional()
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
    create: protectedProcedure.input(z2.object({
      title: z2.string(),
      description: z2.string().optional(),
      priority: z2.enum(["low", "medium", "high", "urgent"]).optional(),
      dueDate: z2.date().optional()
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
  ia: aiRouter,
  // INTEGRAÇÕES EXTERNAS
  integrations: integrationsRouter,
  // ADMIN - GESTÃO DE EMPRESAS
  admin: router({
    companies: router({
      createWithTestUser: adminProcedure.input(z2.object({
        companyName: z2.string().min(1),
        cnpj: z2.string().optional(),
        description: z2.string().optional(),
        plan: z2.enum(["starter", "professional", "enterprise"]).default("starter")
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
      getById: adminProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
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
app.use(express.static("dist/public"));
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile("dist/public/index.html", { root: "." });
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
