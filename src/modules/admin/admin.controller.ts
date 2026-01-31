import { Request, Response } from "express";
import { adminService } from "./admin.service";

const getDashboard = async (req: Request, res: Response) => {
    try {
        const stats = await adminService.getDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
};

const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await adminService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }
        const { status } = req.body;
        const user = await adminService.updateUserStatus(id, status);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user status" });
    }
};

const getBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await adminService.getAllBookings();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};

const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await adminService.getAllCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};

const createCategory = async (req: Request, res: Response) => {
    try {
        const categoryData = req.body;
        console.log('Creating category:', categoryData);
        const category = await adminService.createCategory(categoryData);
        res.status(201).json(category);
    } catch (error: any) {
        console.error('Category creation error:', error);
        res.status(500).json({ error: "Failed to create category", details: error.message });
    }
};

export const adminController = {
    getDashboard,
    getUsers,
    updateUserStatus,
    getBookings,
    getCategories,
    createCategory,
};