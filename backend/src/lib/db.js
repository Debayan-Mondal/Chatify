import mongoose, { mongo } from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Database Connected...");
    } catch(err) {
        console.error("Error Connection to Mongodb", err);
        process.exit(1)
    }
}