const mongoose = require('mongoose');
const db = process.env.MONGO_URI;

console.log('Connecting to MongoDB...',db);

const connectDB = async () => {
  try {
    await mongoose.connect(db);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('db connected error: ',err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;