import { Request, Response } from "express";
import { studentService } from "./student.service";

const getDashboard = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const dashboard = await studentService.getDashboardData(userId);
        res.json(dashboard);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch dashboard" });
    }
};

const getBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const bookings = await studentService.getStudentBookings(userId);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};

const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const profile = await studentService.getStudentProfile(userId);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch profile" });
    }
};

const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const profileData = req.body;
        const profile = await studentService.updateStudentProfile(userId, profileData);
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: "Failed to update profile" });
    }
};

const cancelBooking = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Booking ID is required" });
        }
        const booking = await studentService.cancelBooking(userId, id);
        res.json(booking);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to cancel booking", details: error.message });
    }
};

export const studentController = {
    getDashboard,
    getBookings,
    cancelBooking,
    getProfile,
    updateProfile,
};