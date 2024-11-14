import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendSuccessResponse, sendErrorResponse } from "../utils/responseHelper";

// Login user and generate JWT
export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return sendErrorResponse(res, 400, "Invalid email");
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendErrorResponse(res, 400, "Invalid password");
    }

    // Create access token (short-lived)
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1h" } // Expiry time of the access token
    );

    // Create refresh token (long-lived)
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET as string, // You should set a different secret for refresh tokens
      { expiresIn: "7d" } // Expiry time of the refresh token (7 days)
    );

    // Save refresh token to the database
    user.refreshToken = refreshToken;
    await user.save();

    // Send both tokens in the response
    sendSuccessResponse(res, 200, { accessToken, refreshToken }, "User logged in successfully");
  } catch (error: any) {
    sendErrorResponse(res, 500, "Error logging in user");
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { refreshToken } = req.body;

    // Check if refresh token is provided
    if (!refreshToken) {
      return sendErrorResponse(res, 400, "Refresh token is required");
    }

    // Find the user by refresh token
    const user = await User.findOne({ refreshToken });
    if (!user) {
      return sendErrorResponse(res, 403, "Invalid refresh token");
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (err: any) => {
      if (err) {
        return sendErrorResponse(res, 403, "Invalid or expired refresh token");
      }

      // If the refresh token is valid, issue a new access token
      const newAccessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "1h" } // Expiry time of the new access token
      );

      sendSuccessResponse(res, 200, { accessToken: newAccessToken }, "Access token refreshed successfully");
    });
  } catch (error: any) {
    sendErrorResponse(res, 500, "Error refreshing token");
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
