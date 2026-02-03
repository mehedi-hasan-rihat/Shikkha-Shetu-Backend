// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized - please login" });
    }
    // console.log("Authenticated user:", session.user);
    req.user = { ...session.user, role: session.user.role as any }; // cast role to proper type
    next();
  } catch (err) {
    res.status(401).json({ error: "Session invalid" });
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