import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import path from "path";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({origin: ENV.CLIENT_URL, credentials: true}));
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