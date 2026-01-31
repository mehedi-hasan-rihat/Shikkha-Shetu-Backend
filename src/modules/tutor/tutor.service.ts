import { prisma } from "../../lib/prisma";

export class TutorService {
    static async findAll(filters: any) {
        return prisma.tutorProfile.findMany({
            where: { role: 'TUTOR' },
        });
    }

    static async findById(id: string) {
        return prisma.tutorProfile.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true, image: true } },
                category: true,
                reviews: { include: { student: { select: { name: true } } } },
            },
        });
    }

    static async create(data: any) {
        return prisma.tutorProfile.create({
            data,
            include: { user: true, category: true },
        });
    }
}
