import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://msmithfl:2Pw2LHotPsQUrWQR@skate-log.iqtsw2g.mongodb.net/skate-log?retryWrites=true&w=majority"
);

app.listen(3001, () => console.log("SERVER STARTED!"));
