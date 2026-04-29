import mongoose from 'mongoose';

declare global {
  var mongoose: { conn: any; promise: any };
}

async function connectDB() {
  if (global.mongoose?.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose
      .connect(process.env.MONGODB_URI!)
      .then((mongooseInstance) => {
        console.log('MongoDB connected');
        return mongooseInstance;
      });
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default connectDB;
