import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import path from "path";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";


const app = express();
const __dirname = path.resolve();

const PORT  = ENV.PORT;
app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);


app.listen(PORT,() => {
    console.log("Server is Runing on port 3000");
    connectDB();
})

//make ready for developement
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(__dirname, "../frontend/dist/index.html")
    })
}