// Browser-compatible database configuration
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || '';
const DB_NAME = import.meta.env.VITE_DB_NAME || 'victoriamotors';

// Allow the app to run without MongoDB for demo purposes
const isDatabaseAvailable = !!MONGODB_URI && typeof window === 'undefined';

// Only define mongoose-related types and functions if we're in a Node.js environment
let mongoose: any = null;
let connectToDatabase: (() => Promise<any>) | null = null;

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

if (!isBrowser && isDatabaseAvailable) {
  // Only import mongoose in Node.js environment
  try {
    mongoose = require('mongoose');
    
    interface MongooseCache {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    }

    declare global {
      var mongoose: MongooseCache | undefined;
    }

    let cached = global.mongoose;

    if (!cached) {
      cached = global.mongoose = { conn: null, promise: null };
    }

    connectToDatabase = async (): Promise<typeof mongoose> => {
      if (cached!.conn) {
        return cached!.conn;
      }

      if (!cached!.promise) {
        const opts = {
          bufferCommands: false,
          dbName: DB_NAME,
        };

        cached!.promise = mongoose.connect(MONGODB_URI, opts);
      }

      try {
        cached!.conn = await cached!.promise;
        console.log('Connected to MongoDB Atlas');
      } catch (e) {
        cached!.promise = null;
        console.error('MongoDB connection error:', e);
        throw e;
      }

      return cached!.conn;
    };
  } catch (error) {
    console.warn('Mongoose not available, running in demo mode');
  }
}

// Fallback function for browser environment
if (!connectToDatabase) {
  connectToDatabase = async () => {
    throw new Error('Database not available in browser environment');
  };
}

export { connectToDatabase as default, isDatabaseAvailable };