const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';

  try {
    // Attempt standard connection first with a fast serverSelectionTimeoutMS
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected to external MongoDB at ${uri}`);
    return mongoose.connection;
  } catch (err) {
    console.warn(`[Database] Standalone MongoDB not reachable at ${uri}. Launching local embedded MongoDB for seamless zero-config experience...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'imovies',
        },
      });
      const inMemoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected to embedded in-memory MongoDB at ${inMemoryUri}`);
      return mongoose.connection;
    } catch (memErr) {
      console.error('[Database] Failed to initialize embedded MongoDB:', memErr.message);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('[Database] Disconnected from MongoDB');
  } catch (error) {
    console.error('[Database] Disconnect error:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
