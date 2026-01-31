// src/types/express.d.ts
import { User } from "better-auth/types";

type UserRole = "STUDENT" | "TUTOR" | "ADMIN";

declare global {
  namespace Express {
    interface Request {
      user?: User & { role?: UserRole };
    }
  }
}