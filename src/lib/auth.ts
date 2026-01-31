import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false,
  },
  trustedOrigins: [process.env.APP_URL || "http://localhost:3000", "http://localhost:4000"],
});


//
// GOOGLE_CLIENT_ID
// GOOGLE_CLIENT_SECRET