import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

const register = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ message: "User registered successfully" });
});

const login = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "User logged in successfully" });
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ message: "User logged out successfully" });
});

export { login, logout, register };
