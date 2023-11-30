import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export default async function connect() {
    mongoose.set('strictQuery', true);
    const db = await mongoose.connect(process.env.ATLAS_URI);
    console.log("Database Connected");
    return db;
}
