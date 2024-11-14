import app from './app';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set port from environment variable or default to 5000
const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
