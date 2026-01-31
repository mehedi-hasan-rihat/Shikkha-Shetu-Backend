import { Request, Response } from "express";
import { tutorService } from "./tutor.service";

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
        const tutorData = req.body;
        
        delete tutorData.rating;
        delete tutorData.totalReviews;
        
        const profile = await tutorService.updateTutorProfile(userId, tutorData);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
};

const updateAvailability = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { availabilitySlots } = req.body;
        
        const profile = await tutorService.updateAvailability(userId, availabilitySlots);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: "Failed to update availability" });
    }
};

export const tutorController = {
    getAllTutors,
    getTutorById,
    createProfile,
    updateProfile,
    updateAvailability,
};
