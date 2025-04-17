import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('MongoDB connected');
    
    // Test the connection
    const collections = await mongoose.connection.db.collections();
    console.log('Available collections:', collections.map(c => c.collectionName));
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};