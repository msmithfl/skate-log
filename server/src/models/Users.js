import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  completedTricks: [{ type: mongoose.Schema.Types.ObjectId, ref: "tricks" }],
  wishlistTricks: [{ type: mongoose.Schema.Types.ObjectId, ref: "tricks" }],
});

export const UserModel = mongoose.model("users", UserSchema);
