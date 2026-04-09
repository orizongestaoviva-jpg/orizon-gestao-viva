/**
 * Sistema de Autenticação JWT + Refresh Token com RBAC
 */

import { SignJWT, jwtVerify, JWTPayload } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
const REFRESH_SECRET = new TextEncoder().encode(process.env.REFRESH_SECRET || "your-refresh-secret");

export interface TokenPayload {
  userId: number;
  email: string;
  companyId?: number;
  profile: "operacional" | "tatico" | "estrategico" | "admin_master";
  role: "admin" | "user";
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  userId: number;
  iat: number;
  exp: number;
}

// ============ JWT GENERATION ============

export async function generateAccessToken(payload: Omit<TokenPayload, "iat" | "exp">) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(JWT_SECRET);

  return token;
}

export async function generateRefreshToken(userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);

  return token;
}

export async function generateTokenPair(payload: Omit<TokenPayload, "iat" | "exp">) {
  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload.userId);

  return { accessToken, refreshToken };
}

// ============ JWT VERIFICATION ============

export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as TokenPayload;
  } catch (error) {
    console.error("[Auth] Invalid access token:", error);
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
  try {
    const verified = await jwtVerify(token, REFRESH_SECRET);
    return verified.payload as unknown as RefreshTokenPayload;
  } catch (error) {
    console.error("[Auth] Invalid refresh token:", error);
    return null;
  }
}

// ============ RBAC (Role-Based Access Control) ============

export const permissions = {
  operacional: {
    // Operacional vê apenas suas tarefas, ponto, metas pessoais
    modules: ["dashboard", "tarefas", "ponto", "metas", "reunioes", "comunicacao", "ia"],
    canView: ["own_data", "team_announcements"],
    canCreate: ["tasks", "time_records"],
    canEdit: ["own_tasks"],
    canDelete: ["own_tasks"],
  },
  tatico: {
    // Tático vê seu time, performance, gestão
    modules: [
      "dashboard",
      "colaboradores",
      "vendas",
      "tarefas",
      "ponto",
      "metas",
      "avaliacao",
      "clima",
      "reunioes",
      "comunicacao",
      "ia",
      "remote_performance",
    ],
    canView: ["team_data", "team_performance", "team_sales", "team_goals"],
    canCreate: ["tasks", "evaluations", "goals"],
    canEdit: ["team_tasks", "team_goals"],
    canDelete: ["team_tasks"],
  },
  estrategico: {
    // Estratégico vê consolidações e indicadores estratégicos
    modules: [
      "dashboard",
      "vendas",
      "colaboradores",
      "metas",
      "avaliacao",
      "clima",
      "reunioes",
      "comunicacao",
      "ia",
      "remote_performance",
    ],
    canView: ["company_data", "company_performance", "company_sales", "company_goals", "analytics"],
    canCreate: ["goals", "surveys"],
    canEdit: ["company_goals"],
    canDelete: [],
  },
  admin_master: {
    // Admin vê tudo
    modules: [
      "dashboard",
      "colaboradores",
      "vendas",
      "recrutamento",
      "onboarding",
      "treinamentos",
      "ponto",
      "dp_digital",
      "tarefas",
      "metas",
      "avaliacao",
      "clima",
      "saude",
      "cultura",
      "feed",
      "reunioes",
      "agenda",
      "ia",
      "admin",
      "remote_performance",
    ],
    canView: ["all_data"],
    canCreate: ["tasks", "evaluations", "goals", "surveys", "companies"],
    canEdit: ["all_data"],
    canDelete: ["all_data"],
  },
};

export function canAccessModule(profile: string, module: string): boolean {
  const profilePermissions = permissions[profile as keyof typeof permissions];
  if (!profilePermissions) return false;
  return profilePermissions.modules.includes(module);
}

export function canViewData(profile: string, dataType: string): boolean {
  const profilePermissions = permissions[profile as keyof typeof permissions];
  if (!profilePermissions) return false;
  return profilePermissions.canView.includes(dataType) || profilePermissions.canView.includes("all_data");
}

export function canCreateResource(profile: string, resourceType: string): boolean {
  const profilePermissions = permissions[profile as keyof typeof permissions];
  if (!profilePermissions) return false;
  if (profile === "admin_master") return true;
  return profilePermissions.canCreate.includes(resourceType);
}

export function canEditResource(profile: string, resourceType: string): boolean {
  const profilePermissions = permissions[profile as keyof typeof permissions];
  if (!profilePermissions) return false;
  if (profile === "admin_master") return true;
  return profilePermissions.canEdit.includes(resourceType);
}

export function canDeleteResource(profile: string, resourceType: string): boolean {
  const profilePermissions = permissions[profile as keyof typeof permissions];
  if (!profilePermissions) return false;
  if (profile === "admin_master") return true;
  return (profilePermissions.canDelete as string[]).includes(resourceType);
}

// ============ COOKIE MANAGEMENT ============
// Note: Cookie management should be handled by the server framework (Express, etc)
// This is a placeholder for integration with your server

// ============ PASSWORD HASHING ============

import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
