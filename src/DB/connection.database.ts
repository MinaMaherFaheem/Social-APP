import { connect } from "mongoose";
import { UserModel } from "../models/user.model";



const connectDB = async (): Promise<void> => {
  try {

    const result = await connect (process.env.DB_URL as string, {
      serverSelectionTimeoutMS: 30000,
    });

    await UserModel.syncIndexes();
    console.log(result.models);
    console.log("Database Connected Successfully 🚀");

  } catch (error) {
    console.error("Failed to Connect Database ❌", error);
  }
};

export default connectDB