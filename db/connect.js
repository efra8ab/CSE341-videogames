const mongoose = require('mongoose');

const connectDb = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Missing MONGODB_URI in environment variables');
  }

  try {
    await mongoose.connect(uri, {
      // default to the class naming convention if DB_NAME is not provided
      dbName: process.env.DB_NAME || 'Project_2',
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    throw error;
  }
};

const disconnectDb = async () => mongoose.disconnect();
const getConnection = () => mongoose.connection;

module.exports = { connectDb, disconnectDb, getConnection };
