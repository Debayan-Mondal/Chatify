import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import path from "path";

dotenv.config();

const app = express();
const _dirname = path.resolve();

const PORT  = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);


app.listen(PORT,() => {
    console.log("Server is Runing on port 3000");
})