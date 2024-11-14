import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendSuccessResponse, sendErrorResponse } from "../utils/responseHelper";

// Login user and generate JWT
export const loginUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 400, "Invalid credentials");
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendErrorResponse(res, 400, "Invalid credentials");
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: "1h", // Expiry time of the token
    });

    sendSuccessResponse(res, 200, { token }, "User logged in successfully");
  } catch (error: any) {
    sendErrorResponse(res, 500, "Error logging in user");
    next(error);
  }
};

// Protect routes - Middleware to check JWT token
export const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return sendErrorResponse(res, 401, "No token, authorization denied");
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    req.user = decoded; 

    next();
  } catch (error: any) {
    sendErrorResponse(res, 401, "Token is not valid");
    next(error);
  }
};
