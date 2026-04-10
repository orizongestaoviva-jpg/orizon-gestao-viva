import * as jose from "jose";
import { ENV } from "./env";

const secret = new TextEncoder().encode(ENV.jwtSecret);

export async function generateJWT(userId: string, email: string, name: string, profile: string) {
  const token = await new jose.SignJWT({
    userId,
    email,
    name,
    profile,
    iat: Math.floor(Date.now() / 1000),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(secret);

  return token;
}

export async function generateRefreshToken(userId: string) {
  const token = await new jose.SignJWT({
    userId,
    type: "refresh",
    iat: Math.floor(Date.now() / 1000),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  return token;
}

export async function verifyJWT(token: string) {
  try {
    const verified = await jose.jwtVerify(token, secret);
    return verified.payload;
  } catch (error) {
    return null;
  }
}

export function getMausOAuthUrl(redirectUri: string) {
  const params = new URLSearchParams({
    client_id: ENV.viteAppId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid profile email",
  });

  return `${ENV.oauthServerUrl}/oauth/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string, redirectUri: string) {
  try {
    const response = await fetch(`${ENV.oauthServerUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: ENV.viteAppId,
        client_secret: ENV.jwtSecret,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[OAuth] Error exchanging code:", error);
    return null;
  }
}
