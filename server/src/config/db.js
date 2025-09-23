import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectToDatabase() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongoUri, {
      autoIndex: env.nodeEnv !== 'production',
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectToDatabase;

