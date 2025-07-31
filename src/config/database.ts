import mongoose from 'mongoose';

const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || '';
const DB_NAME = import.meta.env.VITE_DB_NAME || 'victoriamotors';

// Allow the app to run without MongoDB for demo purposes
const isDatabaseAvailable = !!MONGODB_URI;

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

async function connectToDatabase(): Promise<typeof mongoose> {
  if (!isDatabaseAvailable) {
    console.warn('MongoDB URI not provided - running in demo mode with mock data');
    throw new Error('Database not available');
  }

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
}

export { connectToDatabase as default, isDatabaseAvailable };