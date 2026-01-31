import { prisma } from "../../lib/prisma";

const findAllTutors = async () => {
    console.log("Fetching all tutor profiles");
    return prisma.tutorProfile.findMany({
        include: {
            category: true,
            availabilitySlots: true,

            user: { select: { name: true, email: true, image: true } },
        },
    });
};

const findTutorById = async (id: string) => {
    return prisma.tutorProfile.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, email: true, image: true } },
            category: true,
            availabilitySlots: true,
        },
    });
};

const createTutorProfile = async (data: any, userId: string) => {
    const existing = await prisma.tutorProfile.findUnique({
        where: { userId },
    });

    if (existing) {
        throw new Error("Profile already exists");
    }
    return prisma.tutorProfile.create({
        data: { ...data, userId },
        include: { user: true, category: true },
    });
};

export const tutorService = {
    findAllTutors,
    findTutorById,
    createTutorProfile,
};
