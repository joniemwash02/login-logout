import express from "express";
import { connectToDb } from "./database/db.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  connectToDb();
  console.log("running on http://localhost:5000");
});
