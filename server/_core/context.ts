import { Request, Response } from "express";
import { getUserByOpenId } from "../db";
import { COOKIE_NAME } from "@shared/const";
import { jwtVerify } from "jose";
import { ENV } from "./env";

export interface TrpcContext {
  user: {
    id: number;
    openId: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
    role: "user" | "admin";
    companyId: number | null;
    createdAt: Date;
    updatedAt: Date;
    lastSignedIn: Date;
  } | null | undefined;
  req: Request;
  res: Response;
}

export async function createContext(req: Request, res: Response): Promise<TrpcContext> {
  const sessionToken = req.cookies[COOKIE_NAME];
  let user = null;

  if (sessionToken) {
    try {
      const secret = new TextEncoder().encode(ENV.jwtSecret);
      const verified = await jwtVerify(sessionToken, secret);
      const openId = verified.payload.openId as string;

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
    res,
  };
}
