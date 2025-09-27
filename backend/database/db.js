import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
    
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process if unable to connect
  }
};
