import mongoose from "mongoose";

const TricksSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
});

export const TricksModel = mongoose.model("tricks", TricksSchema);
