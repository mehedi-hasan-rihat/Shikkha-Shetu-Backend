// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    console.log("Auth Middleware - Token:", token);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - please login" });
    }

    // Query session directly from database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });
    console.log("Session found:", session ? "Yes" : "No");
    console.log("Session expired:", session ? session.expiresAt < new Date() : "N/A");

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = { ...session.user, role: session.user.role as any };
    next();
  } catch (err: any) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireTutor = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "TUTOR") {
    return res.status(403).json({ error: "Tutor access only" });
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access only" });
  }
  next();
};

export const requireStudent = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== "STUDENT") {
    return res.status(403).json({ error: "Student access only" });
  }
  next();
};