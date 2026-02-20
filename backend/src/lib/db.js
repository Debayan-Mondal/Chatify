import mongoose from "mongoose"
import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        if (!ENV.MONGO_URI) throw new Error("MONGO_URI is not set")
        const conn = await mongoose.connect(ENV.MONGO_URI);
        console.log("Mongo Database Connected...", conn.connection.host);
    } catch(err) {
        console.error("Error Connection to Mongodb", err);
        process.exit(1)
    }
}