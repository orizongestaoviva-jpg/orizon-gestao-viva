import { Request } from "express";

export function getSessionCookieOptions(req: Request) {
  const isProduction = process.env.NODE_ENV === "production";
  const protocol = req.protocol || "https";
  const isSecure = isProduction || protocol === "https";

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: "none" as const,
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  };
}
