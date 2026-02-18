import mongoose, { mongo } from "mongoose"

export const connectDB = async () => {
    try {
        if (!MONGO_URI) throw new Error("MONGO_URI is not set")
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Database Connected...", conn.connection.host);
    } catch(err) {
        console.error("Error Connection to Mongodb", err);
        process.exit(1)
    }
}