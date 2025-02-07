import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import videoroutes from "./routes/videoupload.js"
dotenv.config();
const app = express();
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:5173", 
      credentials: true, 
    })
  );
app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.use("/api/auth", authRoutes);

app.use("/video/", (req, res, next) => {
  console.log("Received a request to /video/videoupload");
  next();
});
app.use("/video/",videoroutes);



mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to EduSpark MongoDB Atlass '))
.catch(err => console.error('Error connecting:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));