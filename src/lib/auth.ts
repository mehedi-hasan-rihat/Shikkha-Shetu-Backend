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
                    return { data: { ...user, role } };
                },
                after: async (user, ctx) => {
                    if (user.role !== "TUTOR") return;

                    const body = ctx?.body as {
                        bio?: string;
                        hourlyRate?: number;
                        experience?: number;
                        categoryId?: string;
                        subjects?: string;
                        availabilitySlots?: Array<{
                            dayOfWeek: number;
                            startTime: string;
                            endTime: string;
                        }>;
                    };
                                        
                    // Get first available category or create tutor profile without category
                    let categoryId = body?.categoryId;
                    if (!categoryId) {
                        const firstCategory = await prisma.category.findFirst();
                        categoryId = firstCategory?.id;
                    }
                    
                    // Create tutor profile
                    const tutorProfile = await prisma.tutorProfile.create({
                        data: {
                            userId: user.id,
                            bio: body?.bio || null,
                            hourlyRate: body?.hourlyRate || 0,
                            experience: body?.experience || 0,
                            ...(categoryId && { categoryId }),
                            subjects: body?.subjects ? body.subjects.split(',').map(s => s.trim()) : [],
                        },
                    });
                    
                    // Create availability slots if provided
                    if (body?.availabilitySlots && body.availabilitySlots.length > 0) {
                        await prisma.availabilitySlot.createMany({
                            data: body.availabilitySlots.map(slot => ({
                                tutorId: tutorProfile.id,
                                dayOfWeek: slot.dayOfWeek,
                                startTime: slot.startTime,
                                endTime: slot.endTime,
                            })),
                        });
                    }
                },
            },
        },
    },

    trustedOrigins: [
        process.env.APP_URL!, process.env.BETTER_AUTH_URL!    ],
});
