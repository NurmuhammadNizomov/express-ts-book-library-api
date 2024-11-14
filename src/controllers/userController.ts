import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { sendSuccessResponse, sendErrorResponse } from "../utils/responseHelper";

// Register new user
export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendErrorResponse(res, 400, "User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", 
    });

    await user.save();

    sendSuccessResponse(res, 201, { name: user.name, email: user.email }, "User registered successfully");
  } catch (error: any) {
    sendErrorResponse(res, 500, "Error registering user");
    next(error); // Forward error to the error handler middleware
  }
};

// Update user profile
export const updateUserController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { name, email, password } = req.body;
    const userId = req.params.id;

    const updatedUser = await User.findById(userId);

    if (!updatedUser) {
      return sendErrorResponse(res, 404, "User not found");
    }

    if (password) {
      updatedUser.password = await bcrypt.hash(password, 12);
    }
    if (name) updatedUser.name = name;
    if (email) updatedUser.email = email;

    await updatedUser.save();

    sendSuccessResponse(res, 200, { name: updatedUser.name, email: updatedUser.email }, "User updated successfully");
  } catch (error: any) {
    sendErrorResponse(res, 500, "Error updating user");
    next(error);
  }
};

// Get user profile
export const getUserProfileController = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }

    sendSuccessResponse(res, 200, { name: user.name, email: user.email }, "User profile retrieved successfully");
  } catch (error: any) {
    sendErrorResponse(res, 500, "Error retrieving user profile");
    next(error);
  }
};
