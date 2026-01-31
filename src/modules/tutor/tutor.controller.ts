import { Request, Response } from "express";
import { tutorService } from "./tutor.service";

const getAllTutors = async (req: Request, res: Response) => {
    try {
        const tutors = await tutorService.findAllTutors();
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

export const tutorController = {
    getAllTutors,
    getTutorById,
    createProfile,
};
