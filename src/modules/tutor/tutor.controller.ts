import { Request, Response } from "express";
import { tutorService } from "./tutor.service";
import { prisma } from "../../lib/prisma";

const getAllTutors = async (req: Request, res: Response) => {
    try {
        const { category, minRate, maxRate, rating } = req.query;
        const filters: any = {};
        
        if (category) filters.category = category as string;
        if (minRate) filters.minRate = parseFloat(minRate as string);
        if (maxRate) filters.maxRate = parseFloat(maxRate as string);
        if (rating) filters.rating = parseFloat(rating as string);
        
        const tutors = await tutorService.findAllTutors(filters);
        res.json(tutors);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tutors" });
    }
};

const getTutorById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id)
            return res.status(400).json({ error: "Tutor ID is required" });
        const tutor = await tutorService.findTutorById(req.params.id);
        if (!tutor) return res.status(404).json({ error: "Tutor not found" });
        res.json(tutor);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tutor" });
    }
};

const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const profile = await tutorService.getTutorProfile(userId);
        if (!profile) return res.status(404).json({ error: "Tutor profile not found" });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

const createProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const tutorData = req.body;

        delete tutorData.rating;
        delete tutorData.totalReviews;
        
        const profile = await tutorService.createTutorProfile(
            { ...tutorData },
            userId,
        );
        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ error: "Failed to create profile" });
    }
};

const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { name, email, ...tutorData } = req.body;
        
        console.log('Updating profile for user:', userId);
        
        delete tutorData.rating;
        delete tutorData.totalReviews;
        
        // Update user data if provided
        if (name || email) {
            await prisma.user.update({
                where: { id: userId },
                data: { ...(name && { name }), ...(email && { email }) }
            });
        }
        
        // Update tutor profile data
        const profile = await tutorService.updateTutorProfile(userId, tutorData);
        res.json(profile);
    } catch (error: any) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: "Failed to update profile", details: error.message });
    }
};

const getAvailability = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const availability = await tutorService.getAvailability(userId);
        res.json(availability);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch availability" });
    }
};

const addAvailability = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const slotData = req.body;
        const slot = await tutorService.addAvailabilitySlot(userId, slotData);
        res.status(201).json(slot);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to add availability", details: error.message });
    }
};

const deleteAvailability = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Availability slot ID is required" });
        }
        await tutorService.deleteAvailabilitySlot(userId, id);
        res.json({ message: "Availability slot deleted" });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to delete availability", details: error.message });
    }
};

const updateAvailability = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { availabilitySlots } = req.body;
        
        console.log('Updating availability for user:', userId, 'with slots:', availabilitySlots);
        
        const profile = await tutorService.updateAvailability(userId, availabilitySlots);
        res.json(profile);
    } catch (error: any) {
        console.error('Availability update error:', error);
        res.status(500).json({ error: "Failed to update availability", details: error.message });
    }
};

export const tutorController = {
    getAllTutors,
    getTutorById,
    getProfile,
    createProfile,
    updateProfile,
    getAvailability,
    addAvailability,
    updateAvailability,
    deleteAvailability,
};
