import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import helmet from "helmet"; // Import helmet
import compression from "compression"; // Import compression
import rateLimit from "express-rate-limit"; // Import express-rate-limit
import morgan from "morgan"; // Import morgan
import path from "path"; // Import path module
import errorHandler from "./middleware/errorMiddleware"; 
import routes from "./routes"; 

// Load environment variables
dotenv.config();

const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cors({ origin: "*" })); // Enable CORS for all origins
app.use(helmet()); // Add Helmet for security

// Apply compression only in production environment
if (process.env.NODE_ENV === 'production') {
  app.use(compression()); // Enable compression for responses in production
}

// Rate Limiting setup (limit to 100 requests per IP every 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Apply rate limiting to all requests
app.use(limiter);

// Enable Morgan logging only in development environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Use 'dev' format for logging in development
}

// Serve the HTML file at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.use("/api", routes);

app.use(errorHandler);

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
