const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log(`[DB] Attempting connection to MongoDB at: ${uri}`);
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log(`[DB] Successfully connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[DB] Could not connect to external MongoDB: ${err.message}. Switching to in-memory MongoDB fallback...`);
    }
  }

  try {
    console.log('[DB] Starting embedded MongoDB in-memory server...');
    mongoMemoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'clearimpact',
      }
    });
    uri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`[DB] Successfully connected to in-memory MongoDB instance: ${uri}`);
    return conn;
  } catch (err) {
    console.error(`[DB] Fatal error initializing MongoDB:`, err);
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
