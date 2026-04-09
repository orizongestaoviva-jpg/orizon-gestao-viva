import express, { Request, Response } from "express";
import cookieParser from "cookie-parser" assert { type: "commonjs" };
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { validateEnv } from "./env";

validateEnv();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
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

// tRPC routes
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: async (opts) => createContext(opts.req, opts.res),
  })
);

// Serve static files from Vite build
app.use(express.static("dist/public"));

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req: Request, res: Response) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile("dist/public/index.html", { root: "." });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Start server
app.listen(port, () => {
  console.log(`[Server] ORIZON SaaS running on port ${port}`);
});
