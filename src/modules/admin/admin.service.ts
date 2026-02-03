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

const getAdminProfile = async (userId: string) => {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            role: true,
            status: true,
            createdAt: true
        }
    });
};

const updateAdminProfile = async (userId: string, data: any) => {
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
            role: true,
            status: true,
            createdAt: true
        }
    });
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

const updateCategory = async (id: string, data: { name?: string; description?: string }) => {
    return prisma.category.update({
        where: { id },
        data,
        include: {
            _count: {
                select: { tutorProfiles: true }
            }
        }
    });
};

const deleteCategory = async (id: string) => {
    // Check if category has tutors
    const category = await prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { tutorProfiles: true } } }
    });
    
    if (category && category._count.tutorProfiles > 0) {
        throw new Error("Cannot delete category with existing tutors");
    }
    
    return prisma.category.delete({
        where: { id }
    });
};

export const adminService = {
    getDashboardStats,
    getAdminProfile,
    updateAdminProfile,
    getAllUsers,
    updateUserStatus,
    getAllBookings,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};