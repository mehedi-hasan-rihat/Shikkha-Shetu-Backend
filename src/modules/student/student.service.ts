import { prisma } from "../../lib/prisma";

const getDashboardData = async (userId: string) => {
    const [upcomingBookings, totalBookings, completedBookings] = await Promise.all([
        prisma.booking.findMany({
            where: { 
                studentId: userId,
                status: "CONFIRMED",
                scheduledAt: { gte: new Date() }
            },
            include: {
                tutor: { select: { name: true, image: true } }
            },
            take: 5,
            orderBy: { scheduledAt: 'asc' }
        }),
        prisma.booking.count({ where: { studentId: userId } }),
        prisma.booking.count({ where: { studentId: userId, status: "COMPLETED" } })
    ]);

    return {
        upcomingBookings,
        stats: {
            totalBookings,
            completedBookings,
            upcomingCount: upcomingBookings.length
        }
    };
};

const getStudentBookings = async (userId: string) => {
    return prisma.booking.findMany({
        where: { studentId: userId },
        include: {
            tutor: { select: { name: true, image: true, email: true } },
            review: true
        },
        orderBy: { scheduledAt: 'desc' }
    });
};

const getStudentProfile = async (userId: string) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            createdAt: true
        }
    });
};

const updateStudentProfile = async (userId: string, data: any) => {
    return prisma.user.update({
        where: { id: userId },
        data: {
            name: data.name,
            phone: data.phone,
            image: data.image
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            createdAt: true
        }
    });
};

export const studentService = {
    getDashboardData,
    getStudentBookings,
    getStudentProfile,
    updateStudentProfile,
};