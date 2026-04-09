/**
 * ORIZON SaaS - Schema PostgreSQL Completo
 * Todas as 30+ tabelas necessárias para o sistema enterprise
 */

import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  decimal,
  integer,
  enum as pgEnum,
  jsonb,
  date,
  time,
  uuid,
  primaryKey,
  foreignKey,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============ ENUMS ============

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);
export const userProfileEnum = pgEnum("user_profile", ["operacional", "tatico", "estrategico", "admin_master"]);
export const companyStatusEnum = pgEnum("company_status", ["active", "inactive", "suspended"]);
export const companyPlanEnum = pgEnum("company_plan", ["starter", "professional", "enterprise"]);
export const employeeStatusEnum = pgEnum("employee_status", ["active", "inactive", "on_leave", "terminated"]);
export const saleStatusEnum = pgEnum("sale_status", ["prospect", "negotiation", "closed_won", "closed_lost"]);
export const taskStatusEnum = pgEnum("task_status", ["todo", "in_progress", "review", "done"]);
export const taskPriorityEnum = pgEnum("task_priority", ["low", "medium", "high", "urgent"]);
export const goalStatusEnum = pgEnum("goal_status", ["not_started", "in_progress", "completed", "failed"]);
export const evaluationStatusEnum = pgEnum("evaluation_status", ["draft", "in_progress", "completed"]);
export const vacationStatusEnum = pgEnum("vacation_status", ["pending", "approved", "rejected", "completed"]);
export const surveyStatusEnum = pgEnum("survey_status", ["draft", "active", "closed"]);
export const candidateStatusEnum = pgEnum("candidate_status", ["prospect", "interview", "offer", "hired", "rejected"]);
export const attendanceStatusEnum = pgEnum("attendance_status", ["present", "absent", "justified", "pending"]);
export const remoteSessionStatusEnum = pgEnum("remote_session_status", ["active", "paused", "completed"]);
export const focusBlockStatusEnum = pgEnum("focus_block_status", ["active", "paused", "completed"]);
export const moodEnum = pgEnum("mood", ["very_bad", "bad", "neutral", "good", "very_good"]);
export const riskLevelEnum = pgEnum("risk_level", ["low", "medium", "high", "critical"]);

// ============ CORE TABLES ============

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: text("name"),
  password: varchar("password", { length: 255 }), // For local auth
  profile: userProfileEnum("profile").default("operacional"),
  companyId: integer("companyId"),
  departmentId: integer("departmentId"),
  managerId: integer("managerId"),
  role: userRoleEnum("role").default("user"),
  isActive: boolean("isActive").default(true),
  lastLogin: timestamp("lastLogin"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }).unique(),
  description: text("description"),
  ownerId: integer("ownerId").notNull(),
  plan: companyPlanEnum("plan").default("starter"),
  status: companyStatusEnum("status").default("active"),
  maxUsers: integer("maxUsers").default(10),
  maxStorage: decimal("maxStorage", { precision: 10, scale: 2 }).default("10"), // GB
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  headId: integer("headId"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  userId: integer("userId"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  cpf: varchar("cpf", { length: 14 }).unique(),
  phone: varchar("phone", { length: 20 }),
  position: varchar("position", { length: 255 }),
  departmentId: integer("departmentId"),
  managerId: integer("managerId"),
  salary: decimal("salary", { precision: 12, scale: 2 }),
  hireDate: date("hireDate"),
  terminationDate: date("terminationDate"),
  status: employeeStatusEnum("status").default("active"),
  profileType: userProfileEnum("profileType").default("operacional"),
  documents: jsonb("documents"), // CPF, RG, CTPS, etc
  address: jsonb("address"),
  emergencyContact: jsonb("emergencyContact"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// ============ VENDAS & COMISSÕES ============

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  salesPersonId: integer("salesPersonId").notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  value: decimal("value", { precision: 14, scale: 2 }).notNull(),
  commission: decimal("commission", { precision: 12, scale: 2 }),
  status: saleStatusEnum("status").default("prospect"),
  closingDate: date("closingDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const commissions = pgTable("commissions", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  month: varchar("month", { length: 7 }), // YYYY-MM
  totalSales: decimal("totalSales", { precision: 14, scale: 2 }),
  commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }), // %
  commissionAmount: decimal("commissionAmount", { precision: 12, scale: 2 }),
  bonuses: decimal("bonuses", { precision: 12, scale: 2 }),
  deductions: decimal("deductions", { precision: 12, scale: 2 }),
  netCommission: decimal("netCommission", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 50 }), // pending, approved, paid
  createdAt: timestamp("createdAt").defaultNow(),
});

// ============ R&S (RECRUTAMENTO) ============

export const vacancies = pgTable("vacancies", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  departmentId: integer("departmentId"),
  requirements: jsonb("requirements"),
  salary: decimal("salary", { precision: 12, scale: 2 }),
  status: varchar("status", { length: 50 }), // open, closed, filled
  createdAt: timestamp("createdAt").defaultNow(),
});

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  vacancyId: integer("vacancyId"),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  resume: text("resume"),
  status: candidateStatusEnum("status").default("prospect"),
  rating: integer("rating"), // 1-5
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const interviews = pgTable("interviews", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  candidateId: integer("candidateId").notNull(),
  interviewerId: integer("interviewerId"),
  scheduledAt: timestamp("scheduledAt"),
  feedback: text("feedback"),
  rating: integer("rating"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// ============ ONBOARDING ============

export const onboardingChecklists = pgTable("onboarding_checklists", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: date("dueDate"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const onboardingTasks = pgTable("onboarding_tasks", {
  id: serial("id").primaryKey(),
  checklistId: integer("checklistId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  assignedTo: integer("assignedTo"),
  isCompleted: boolean("isCompleted").default(false),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// ============ TREINAMENTOS ============

export const trainingTracks = pgTable("training_tracks", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  departmentId: integer("departmentId"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const trainingModules = pgTable("training_modules", {
  id: serial("id").primaryKey(),
  trackId: integer("trackId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  videoUrl: varchar("videoUrl", { length: 500 }),
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  order: integer("order"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const employeeTraining = pgTable("employee_training", {
  id: serial("id").primaryKey(),
  employeeId: integer("employeeId").notNull(),
  trackId: integer("trackId").notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  progress: integer("progress"), // 0-100
  score: decimal("score", { precision: 5, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

// ============ CLIMA ORGANIZACIONAL ============

export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: surveyStatusEnum("status").default("draft"),
  startDate: date("startDate"),
  endDate: date("endDate"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const surveyQuestions = pgTable("survey_questions", {
  id: serial("id").primaryKey(),
  surveyId: integer("surveyId").notNull(),
  question: text("question").notNull(),
  type: varchar("type", { length: 50 }), // likert, multiple_choice, open_ended
  order: integer("order"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  surveyId: integer("surveyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  questionId: integer("questionId").notNull(),
  answer: text("answer"),
  rating: integer("rating"), // For likert scale
  createdAt: timestamp("createdAt").defaultNow(),
});

// ============ AVALIAÇÃO DE DESEMPENHO ============

export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  evaluatorId: integer("evaluatorId"),
  period: varchar("period", { length: 50 }), // Q1 2024, etc
  status: evaluationStatusEnum("status").default("draft"),
  overallScore: decimal("overallScore", { precision: 5, scale: 2 }),
  feedback: text("feedback"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const evaluationCriteria = pgTable("evaluation_criteria", {
  id: serial("id").primaryKey(),
  evaluationId: integer("evaluationId").notNull(),
  criterion: varchar("criterion", { length: 255 }).notNull(),
  score: decimal("score", { precision: 5, scale: 2 }),
  comments: text("comments"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// ============ METAS & OKRS ============

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId"),
  departmentId: integer("departmentId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  targetValue: decimal("targetValue", { precision: 14, scale: 2 }),
  currentValue: decimal("currentValue", { precision: 14, scale: 2 }),
  status: goalStatusEnum("status").default("not_started"),
  dueDate: date("dueDate"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// ============ TAREFAS & KANBAN ============

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  assignedTo: integer("assignedTo"),
  createdBy: integer("createdBy"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("todo"),
  priority: taskPriorityEnum("priority").default("medium"),
  dueDate: date("dueDate"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// ============ COMUNICAÇÃO INTERNA ============

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  authorId: integer("authorId").notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  attachments: jsonb("attachments"),
  likes: integer("likes").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  authorId: integer("authorId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// ============ REUNIÕES & AGENDA ============

export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  location: varchar("location", { length: 255 }),
  organizer: integer("organizer"),
  meetingLink: varchar("meetingLink", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const meetingAttendees = pgTable("meeting_attendees", {
  id: serial("id").primaryKey(),
  meetingId: integer("meetingId").notNull(),
  employeeId: integer("employeeId").notNull(),
  status: varchar("status", { length: 50 }), // accepted, declined, tentative
  createdAt: timestamp("createdAt").defaultNow(),
});

// ============ DEPARTAMENTO PESSOAL ============

export const timeRecords = pgTable("time_records", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  date: date("date").notNull(),
  checkIn: timestamp("checkIn"),
  checkOut: timestamp("checkOut"),
  status: attendanceStatusEnum("status").default("pending"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const vacationRequests = pgTable("vacation_requests", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  days: integer("days"),
  status: vacationStatusEnum("status").default("pending"),
  approvedBy: integer("approvedBy"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const medicalCertificates = pgTable("medical_certificates", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  startDate: date("startDate"),
  endDate: date("endDate"),
  days: integer("days"),
  fileUrl: varchar("fileUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const benefits = pgTable("benefits", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  type: varchar("type", { length: 100 }), // health_insurance, dental, meal_voucher, etc
  value: decimal("value", { precision: 12, scale: 2 }),
  startDate: date("startDate"),
  endDate: date("endDate"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// ============ ORIZON REMOTE PERFORMANCE ============

export const remoteSessions = pgTable("remote_sessions", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  date: date("date").notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  status: remoteSessionStatusEnum("status").default("active"),
  totalFocusMinutes: integer("totalFocusMinutes").default(0),
  totalBreakMinutes: integer("totalBreakMinutes").default(0),
  contextSwitches: integer("contextSwitches").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const remoteCheckins = pgTable("remote_checkins", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  sessionId: integer("sessionId"),
  mood: moodEnum("mood"),
  priorityClarity: integer("priorityClarity"), // 1-10
  psychosocialRisk: riskLevelEnum("psychosocialRisk"),
  workload: varchar("workload", { length: 50 }), // light, normal, heavy, overwhelming
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const focusBlocks = pgTable("focus_blocks", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  sessionId: integer("sessionId"),
  taskName: varchar("taskName", { length: 255 }),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime"),
  duration: integer("duration"), // minutes
  status: focusBlockStatusEnum("status").default("active"),
  interruptions: integer("interruptions").default(0),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const remoteActivityLog = pgTable("remote_activity_log", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  sessionId: integer("sessionId"),
  activity: varchar("activity", { length: 255 }),
  timestamp: timestamp("timestamp").notNull(),
  duration: integer("duration"), // seconds
  createdAt: timestamp("createdAt").defaultNow(),
});

export const remoteProductivityIndex = pgTable("remote_productivity_index", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  date: date("date").notNull(),
  deliveriesScore: decimal("deliveriesScore", { precision: 5, scale: 2 }), // 0-100
  focusScore: decimal("focusScore", { precision: 5, scale: 2 }),
  engagementScore: decimal("engagementScore", { precision: 5, scale: 2 }),
  wellbeingScore: decimal("wellbeingScore", { precision: 5, scale: 2 }),
  overallIndex: decimal("overallIndex", { precision: 5, scale: 2 }), // 0-100
  createdAt: timestamp("createdAt").defaultNow(),
});

export const remoteWeeklyHeatmap = pgTable("remote_weekly_heatmap", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  weekStart: date("weekStart").notNull(),
  heatmapData: jsonb("heatmapData"), // 7 days x 24 hours
  mostProductiveDay: varchar("mostProductiveDay", { length: 20 }),
  mostProductiveHour: varchar("mostProductiveHour", { length: 5 }),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const remoteRiskIndicators = pgTable("remote_risk_indicators", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  employeeId: integer("employeeId").notNull(),
  date: date("date").notNull(),
  burnoutRisk: riskLevelEnum("burnoutRisk"),
  turnoverRisk: riskLevelEnum("turnoverRisk"),
  wellbeingRisk: riskLevelEnum("wellbeingRisk"),
  overloadRisk: riskLevelEnum("overloadRisk"),
  disengagementRisk: riskLevelEnum("disengagementRisk"),
  recommendations: jsonb("recommendations"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// ============ AUDITORIA & LOGS ============

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId"),
  userId: integer("userId"),
  action: varchar("action", { length: 255 }).notNull(),
  resource: varchar("resource", { length: 255 }),
  resourceId: integer("resourceId"),
  changes: jsonb("changes"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// ============ NOTIFICAÇÕES ============

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  userId: integer("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  type: varchar("type", { length: 50 }), // alert, info, warning, success
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

// ============ RELATIONS ============

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  manager: one(users, {
    fields: [users.managerId],
    references: [users.id],
  }),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  company: one(companies, {
    fields: [employees.companyId],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
  manager: one(employees, {
    fields: [employees.managerId],
    references: [employees.id],
  }),
}));

// ============ TYPES ============

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

export type Sale = typeof sales.$inferSelect;
export type InsertSale = typeof sales.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

export type RemoteSession = typeof remoteSessions.$inferSelect;
export type InsertRemoteSession = typeof remoteSessions.$inferInsert;

export type RemoteProductivityIndex = typeof remoteProductivityIndex.$inferSelect;
export type InsertRemoteProductivityIndex = typeof remoteProductivityIndex.$inferInsert;

export type RemoteRiskIndicators = typeof remoteRiskIndicators.$inferSelect;
export type InsertRemoteRiskIndicators = typeof remoteRiskIndicators.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
