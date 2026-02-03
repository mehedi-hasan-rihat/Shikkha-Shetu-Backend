import { prisma } from "../../lib/prisma";

const dayOfWeekToNumber = (day: string): number => {
    const dayMap: { [key: string]: number } = {
        'SUNDAY': 0,
        'MONDAY': 1,
        'TUESDAY': 2,
        'WEDNESDAY': 3,
        'THURSDAY': 4,
        'FRIDAY': 5,
        'SATURDAY': 6
    };
    return dayMap[day] ?? 0;
};

const numberToDayOfWeek = (num: number): string => {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[num] || 'SUNDAY';
};

const findAllTutors = async (filters?: {
    category?: string;
    minRate?: number;
    maxRate?: number;
    rating?: number;
}) => {
    
    const where: any = {};
    
    if (filters?.category) {
        where.category = { name: { contains: filters.category, mode: 'insensitive' } };
    }
    if (filters?.minRate || filters?.maxRate) {
        where.hourlyRate = {};
        if (filters.minRate) where.hourlyRate.gte = filters.minRate;
        if (filters.maxRate) where.hourlyRate.lte = filters.maxRate;
    }
    if (filters?.rating) {
        where.rating = { gte: filters.rating };
    }
    
    return prisma.tutorProfile.findMany({
        where,
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

const getTutorProfile = async (userId: string) => {
    return prisma.tutorProfile.findUnique({
        where: { userId },
        include: {
            user: { select: { id: true, name: true, email: true, image: true, role: true } },
            category: true,
            availabilitySlots: true,
        },
    });
};

const getTutorBookings = async (userId: string) => {
    return prisma.booking.findMany({
        where: { tutorId: userId },
        include: {
            student: { select: { name: true, email: true } },
            review: true
        },
        orderBy: { scheduledAt: 'desc' }
    });
};

const completeBooking = async (userId: string, bookingId: string) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId }
    });
    
    if (!booking) {
        throw new Error("Booking not found");
    }
    
    if (booking.tutorId !== userId) {
        throw new Error("Not authorized to complete this booking");
    }
    
    return prisma.booking.update({
        where: { id: bookingId },
        data: { status: "COMPLETED" },
        include: {
            student: { select: { name: true, email: true } }
        }
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
    console.log('Service: updating profile for userId:', userId, 'with data:', data);
    
    try {
        return await prisma.tutorProfile.update({
            where: { userId },
            data,
            include: { user: true, category: true, availabilitySlots: true },
        });
    } catch (error: any) {
        console.error('Prisma update error:', error);
        throw error;
    }
};

const getAvailability = async (userId: string) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId },
        include: { availabilitySlots: true }
    });
    return tutorProfile?.availabilitySlots || [];
};

const addAvailabilitySlot = async (userId: string, slotData: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId }
    });
    
    if (!tutorProfile) {
        throw new Error("Tutor profile not found");
    }
    
    return prisma.availabilitySlot.create({
        data: {
            tutorId: tutorProfile.id,
            dayOfWeek: dayOfWeekToNumber(slotData.dayOfWeek),
            startTime: slotData.startTime,
            endTime: slotData.endTime
        }
    });
};

const deleteAvailabilitySlot = async (userId: string, slotId: string) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId }
    });
    
    if (!tutorProfile) {
        throw new Error("Tutor profile not found");
    }
    
    return prisma.availabilitySlot.delete({
        where: {
            id: slotId,
            tutorId: tutorProfile.id
        }
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
    
    if (!availabilitySlots || !Array.isArray(availabilitySlots)) {
        throw new Error("Availability slots array is required");
    }
    
    // Delete existing slots and create new ones
    await prisma.availabilitySlot.deleteMany({
        where: { tutorId: tutorProfile.id }
    });
    
    if (availabilitySlots.length > 0) {
        await prisma.availabilitySlot.createMany({
            data: availabilitySlots.map(slot => ({
                tutorId: tutorProfile.id,
                dayOfWeek: dayOfWeekToNumber(slot.dayOfWeek),
                startTime: slot.startTime,
                endTime: slot.endTime
            }))
        });
    }
    
    return prisma.tutorProfile.findUnique({
        where: { userId },
        include: { user: true, category: true, availabilitySlots: true },
    });
};

export const tutorService = {
    findAllTutors,
    findTutorById,
    getTutorProfile,
    getTutorBookings,
    completeBooking,
    createTutorProfile,
    updateTutorProfile,
    getAvailability,
    addAvailabilitySlot,
    updateAvailability,
    deleteAvailabilitySlot,
};
