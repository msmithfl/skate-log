import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({ message: "User Already Exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();

  res.json({ message: "User Registered Successfully!" });
});

router.post("/login", async (req, res) => {
  // values from the front end
  const { username, password } = req.body;

  // search for requested user
  const user = await UserModel.findOne({ username });

  // if logging in with account that does not exist, return
  if (!user) {
    return res.json({ message: "User Doesn't Exist!" });
  }

  // comparing the entered password with the encrypted database password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // if password does not match, return
  if (!isPasswordValid) {
    return res.json({ message: "Username or Password is Incorrect!" });
  }

  // correctly logging in
  // creating a json web token
  const token = jwt.sign({ id: user._id }, "secret");
  res.json({ token, userID: user._id });
});

export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret", (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
