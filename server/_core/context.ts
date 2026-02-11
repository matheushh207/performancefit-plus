import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { jwtVerify } from "jose";

type ProfessionalJwtPayload = {
  professionalId: number;
  email: string;
  type: "personal_trainer" | "nutritionist" | "both";
  iat: number;
  exp: number;
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  professional: ProfessionalJwtPayload | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let professional: ProfessionalJwtPayload | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  const authHeader = opts.req.headers["authorization"];
  const token = Array.isArray(authHeader)
    ? authHeader[0]
    : authHeader ?? "";

  if (token?.startsWith("Bearer ")) {
    const jwt = token.slice("Bearer ".length);
    const secretKey = process.env.PROFESSIONAL_JWT_SECRET || "fallback-secret-change-in-production";
    const secret = new TextEncoder().encode(secretKey);

    try {
      const { payload } = await jwtVerify(jwt, secret);
      professional = {
        professionalId: payload.professionalId as number,
        email: payload.email as string,
        type: payload.type as ProfessionalJwtPayload["type"],
        iat: payload.iat as number,
        exp: payload.exp as number,
      };
    } catch {
      professional = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    professional,
  };
}
