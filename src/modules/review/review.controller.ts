import { Request, Response } from "express";
import { reviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
    try {
        const studentId = req.user!.id;
        const reviewData = { ...req.body, studentId };
        const review = await reviewService.createReview(reviewData);
        res.status(201).json(review);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to create review", details: error.message });
    }
};

const getTutorReviews = async (req: Request, res: Response) => {
    try {
        const { tutorId } = req.params;
        if (!tutorId) {
            return res.status(400).json({ error: "Tutor ID is required" });
        }
        const reviews = await reviewService.getTutorReviews(tutorId);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
};

const getBookingReview = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        if (!bookingId) {
            return res.status(400).json({ error: "Booking ID is required" });
        }
        const review = await reviewService.getBookingReview(bookingId);
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch review" });
    }
};

export const reviewController = {
    createReview,
    getTutorReviews,
    getBookingReview,
};