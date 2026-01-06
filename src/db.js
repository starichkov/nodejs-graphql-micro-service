import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connects to the MongoDB database using the URI provided in environment variables.
 * This is a standard way to handle database connections in a Node.js micro-service.
 * @param {string} [uri] - Optional MongoDB URI to override the default one.
 */
const connectDB = async (uri) => {
  try {
    const mongoURI = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/computer-parts-shop';
    
    await mongoose.connect(mongoURI);
    
    console.log('Successfully connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Rethrow error instead of exiting, so it can be handled or caught in tests
    throw error;
  }
};

export default connectDB;
