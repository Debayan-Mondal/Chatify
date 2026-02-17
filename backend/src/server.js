import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const PORT  = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);


app.listen(PORT,() => {
    console.log("Server is Runing on port 3000");
})

//make ready for developement
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(__dirname, "../frontend/dist/index.html")
    })
}