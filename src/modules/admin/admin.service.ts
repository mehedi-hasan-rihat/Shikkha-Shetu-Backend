import { prisma } from "../../lib/prisma";

const getDashboardStats = async () => {
    const [totalUsers, totalTutors, totalStudents, totalBookings, totalCategories, recentBookings] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "TUTOR" } }),
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.booking.count(),
        prisma.category.count(),
        prisma.booking.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                student: { select: { name: true, email: true } },
                tutor: { select: { name: true, email: true } }
            }
        })
    ]);

    return {
        stats: {
            totalUsers,
            totalTutors,
            totalStudents,
            totalBookings,
            totalCategories
        },
        recentBookings
    };
};

const getAllUsers = async () => {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            tutorProfile: {
                select: {
                    rating: true,
                    totalReviews: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

const updateUserStatus = async (userId: string, status: "ACTIVE" | "BANNED" | "SUSPENDED") => {
    return prisma.user.update({
        where: { id: userId },
        data: { status },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
        }
    });
};

const getAllBookings = async () => {
    return prisma.booking.findMany({
        include: {
            student: { select: { name: true, email: true } },
            tutor: { select: { name: true, email: true } },
            review: true
        },
        orderBy: { createdAt: 'desc' }
    });
};

const getAllCategories = async () => {
    return prisma.category.findMany({
        include: {
            _count: {
                select: { tutorProfiles: true }
            }
        },
        orderBy: { name: 'asc' }
    });
};

const createCategory = async (data: { name: string; description?: string }) => {
    return prisma.category.create({
        data,
        include: {
            _count: {
                select: { tutorProfiles: true }
            }
        }
    });
};

export const adminService = {
    getDashboardStats,
    getAllUsers,
    updateUserStatus,
    getAllBookings,
    getAllCategories,
    createCategory,
};