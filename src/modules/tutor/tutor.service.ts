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

const updateTutorProfile = async (userId: string, data: any) => {
    return prisma.tutorProfile.update({
        where: { userId },
        data,
        include: { user: true, category: true },
    });
};

const updateAvailability = async (userId: string, availabilitySlots: any[]) => {
    // First get the tutor profile
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId }
    });
    
    if (!tutorProfile) {
        throw new Error("Tutor profile not found");
    }
    
    // Delete existing slots and create new ones
    await prisma.availabilitySlot.deleteMany({
        where: { tutorId: tutorProfile.id }
    });
    
    await prisma.availabilitySlot.createMany({
        data: availabilitySlots.map(slot => ({
            ...slot,
            tutorId: tutorProfile.id
        }))
    });
    
    return prisma.tutorProfile.findUnique({
        where: { userId },
        include: { user: true, category: true, availabilitySlots: true },
    });
};

export const tutorService = {
    findAllTutors,
    findTutorById,
    createTutorProfile,
    updateTutorProfile,
    updateAvailability,
};
