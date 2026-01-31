import { Request, Response } from "express";
import { TutorService } from "./tutor.service";

export class TutorController {
    static async getAllTutors(req: Request, res: Response) {
        try {
            const tutors = await TutorService.findAll(req.query);
            res.json(tutors);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch tutors" });
        }
    }

    static async getTutorById(req: Request, res: Response) {
        try {
            if (!req.params.id)
                return res.status(400).json({ error: "Tutor ID is required" });
            const tutor = await TutorService.findById(req.params.id);
            if (!tutor)
                return res.status(404).json({ error: "Tutor not found" });
            res.json(tutor);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch tutor" });
        }
    }

    static async createProfile(req: Request, res: Response) {
        try {
            const profile = await TutorService.create(req.body);
            res.status(201).json(profile);
        } catch (error) {
            res.status(500).json({ error: "Failed to create profile" });
        }
    }
}
