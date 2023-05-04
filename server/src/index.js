import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import { userRouter } from "./routes/users.js";
import { tricksRouter } from "./routes/tricks.js";

import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.MONGO_DB_API_PASSWORD;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/tricks", tricksRouter);

mongoose.connect(
  `mongodb+srv://msmithfl:${apiKey}@skate-log.iqtsw2g.mongodb.net/skate-log?retryWrites=true&w=majority`
);

app.listen(3001, () => console.log("SERVER STARTED!"));
