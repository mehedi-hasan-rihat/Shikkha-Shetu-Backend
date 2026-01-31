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
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "STUDENT",
                input: true,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user, ctx) => {
                    const body = ctx?.body as { role?: "student" | "tutor" };
                    const role = body?.role === "tutor" ? "TUTOR" : "STUDENT";
                    console.log("USER ROLE", role, user, body);
                    return { data: { ...user, role } };
                },
            },
        },
    },

    trustedOrigins: [
        process.env.APP_URL || "http://localhost:3000",
        "http://localhost:4000",
    ],
});

//
// GOOGLE_CLIENT_ID
// GOOGLE_CLIENT_SECRET
