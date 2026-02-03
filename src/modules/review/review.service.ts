import { prisma } from "../../lib/prisma";

const createReview = async (data: {
    bookingId: string;
    studentId: string;
    rating: number;
    comment?: string;
}) => {
    // Get booking to find tutor
    const booking = await prisma.booking.findUnique({
        where: { id: data.bookingId },
        include: { tutor: { include: { tutorProfile: true } } }
    });
    
    if (!booking) {
        throw new Error("Booking not found");
    }
    
    if (booking.studentId !== data.studentId) {
        throw new Error("Not authorized to review this booking");
    }
    
    if (booking.status !== "COMPLETED") {
        throw new Error("Can only review completed sessions");
    }
    
    // Create review
    const review = await prisma.review.create({
        data: {
            bookingId: data.bookingId,
            studentId: data.studentId,
            tutorId: booking.tutorId,
            rating: data.rating,
            comment: data.comment || null
        },
        include: {
            student: { select: { name: true } },
            booking: { select: { scheduledAt: true } }
        }
    });
    
    // Update tutor rating
    await updateTutorRating(booking.tutorId);
    
    return review;
};

const updateTutorRating = async (tutorId: string) => {
    const reviews = await prisma.review.findMany({
        where: { tutorId }
    });
    
    if (reviews.length > 0) {
        const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        
        // Find tutor profile by userId
        const tutorProfile = await prisma.tutorProfile.findUnique({
            where: { userId: tutorId }
        });
        
        if (tutorProfile) {
            await prisma.tutorProfile.update({
                where: { id: tutorProfile.id },
                data: {
                    rating: Math.round(avgRating * 10) / 10,
                    totalReviews: reviews.length
                }
            });
        }
    }
};

const getTutorReviews = async (tutorId: string) => {
    return prisma.review.findMany({
        where: { tutorId },
        include: {
            student: { select: { name: true } },
            booking: { select: { scheduledAt: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

const getBookingReview = async (bookingId: string) => {
    return prisma.review.findUnique({
        where: { bookingId },
        include: {
            student: { select: { name: true } }
        }
    });
};

export const reviewService = {
    createReview,
    getTutorReviews,
    getBookingReview,
};