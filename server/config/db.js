const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // 1. If explicit MongoDB URI is provided (e.g. MongoDB Atlas, local mongod, or Docker)
  if (uri && uri.trim()) {
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    try {
      console.log(`[DB] Connecting to MongoDB at: ${maskedUri}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 10,
        socketTimeoutMS: 45000,
      });
      console.log(`[DB] Successfully connected to persistent MongoDB: ${conn.connection.host} (DB: ${conn.connection.name})`);

      mongoose.connection.on('error', (err) => {
        console.error('[DB] MongoDB runtime connection error:', err.message);
      });
      mongoose.connection.on('disconnected', () => {
        console.warn('[DB] MongoDB connection disconnected. Attempting auto-reconnect...');
      });

      return conn;
    } catch (err) {
      console.warn(`[DB] External MongoDB connection failed (${err.message}).`);
      if (process.env.NODE_ENV === 'production') {
        console.error('[DB] Critical: Cannot connect to MongoDB in production environment. Retrying or fallback...');
      }
    }
  }

  // 2. Embedded In-Memory MongoDB Fallback (instant zero-config demo / dev mode)
  try {
    console.log('[DB] Initializing embedded MongoDB in-memory server...');
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'clearimpact',
      }
    });
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`[DB] Successfully connected to in-memory MongoDB instance: ${memoryUri}`);
    return conn;
  } catch (err) {
    console.error(`[DB] Fatal error initializing in-memory MongoDB:`, err.message);
    process.exit(1);
  }
};

const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, closeDB };
