require('dotenv').config();
import mongoose from "mongoose";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

const mongoURI = process.env.MONGO_URI as string;

const seedAdmin = async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(mongoURI);

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ email: "admin@admin.com" });
    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }

    // Create the default admin user
    const saltRounds = 12; // Use a salt factor of 12 for more security
    const adminPassword = await bcrypt.hash("123456", saltRounds); // Increased salt factor

    const adminUser = new User({
      name: "Admin User",
      email: "admin@admin.com",
      password: adminPassword,
      role: "admin",
    });

    await adminUser.save();
    console.log("Admin user created successfully.");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Run the seed script
seedAdmin();
