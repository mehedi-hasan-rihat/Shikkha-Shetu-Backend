import { prisma } from "../../lib/prisma";

const createBooking = async (data: {
    studentId: string;
    tutorId: string;
    sessionDate?: string;
    scheduledAt?: string;
    duration: number;
    notes?: string;
    totalAmount?: number;
    subject?: string;
}) => {
    console.log('Service: creating booking with data:', data);
    
    // Handle both sessionDate and scheduledAt field names
    const scheduledAt = data.sessionDate || data.scheduledAt;
    if (!scheduledAt) {
        throw new Error('Session date is required');
    }
    
    // Validate tutor exists and get user ID
    const tutor = await prisma.tutorProfile.findUnique({
        where: { id: data.tutorId },
        include: { user: true }
    });
    if (!tutor) {
        throw new Error('Tutor not found');
    }
    
    // Calculate total amount if not provided
    let totalAmount = data.totalAmount;
    if (!totalAmount) {
        totalAmount = (tutor.hourlyRate * data.duration) / 60;
    }
    
    return prisma.booking.create({
        data: {
            studentId: data.studentId,
            tutorId: tutor.userId, // Use the User ID, not TutorProfile ID
            scheduledAt: new Date(scheduledAt),
            duration: data.duration,
            notes: data.notes || null,
            totalAmount
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