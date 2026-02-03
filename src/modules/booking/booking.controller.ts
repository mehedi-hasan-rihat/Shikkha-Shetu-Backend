import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
    try {
        const studentId = req.user!.id;
        const bookingData = { ...req.body, studentId };
        console.log('Creating booking with data:', bookingData);
        const booking = await bookingService.createBooking(bookingData);
        res.status(201).json(booking);
    } catch (error: any) {
        console.error('Booking creation error:', error);
        res.status(500).json({ error: "Failed to create booking", details: error.message });
    }
};

const getUserBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const bookings = await bookingService.getUserBookings(userId);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};

const getBookingById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id) {
            return res.status(400).json({ error: "Booking ID is required" });
        }
        const userId = req.user!.id;
        const booking = await bookingService.getBookingById(id, userId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch booking" });
    }
};

export const bookingController = {
    createBooking,
    getUserBookings,
    getBookingById,
};