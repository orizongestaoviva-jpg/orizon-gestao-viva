/**
 * Environment variables validation and access
 */

export const ENV = {
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
  viteFrontendForgeApiKey: process.env.VITE_FRONTEND_FORGE_API_KEY || "",
};

export function validateEnv() {
  const required = [
    "OAUTH_SERVER_URL",
    "VITE_APP_ID",
    "JWT_SECRET",
    "DATABASE_URL",
  ];

  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`[ENV] Missing required variables: ${missing.join(", ")}`);
  }
}
