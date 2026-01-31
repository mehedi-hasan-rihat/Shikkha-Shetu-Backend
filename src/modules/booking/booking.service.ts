import { prisma } from "../../lib/prisma";

const createBooking = async (data: {
    studentId: string;
    tutorId: string;
    scheduledAt: string;
    duration: number;
    notes?: string;
    totalAmount: number;
}) => {
    return prisma.booking.create({
        data: {
            ...data,
            scheduledAt: new Date(data.scheduledAt)
        },
        include: {
            student: { select: { name: true, email: true } },
            tutor: { select: { name: true, email: true } }
        }
    });
};

const getUserBookings = async (userId: string) => {
    return prisma.booking.findMany({
        where: {
            OR: [
                { studentId: userId },
                { tutorId: userId }
            ]
        },
        include: {
            student: { select: { name: true, email: true } },
            tutor: { select: { name: true, email: true } },
            review: true
        },
        orderBy: { scheduledAt: 'desc' }
    });
};

const getBookingById = async (bookingId: string, userId: string) => {
    return prisma.booking.findFirst({
        where: {
            id: bookingId,
            OR: [
                { studentId: userId },
                { tutorId: userId }
            ]
        },
        include: {
            student: { select: { name: true, email: true, phone: true } },
            tutor: { select: { name: true, email: true, phone: true } },
            review: true
        }
    });
};

export const bookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
};