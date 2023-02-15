import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import cookieParser from "cookie-parser";
import imageDownloader from "image-downloader";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

console.log(__dirname);

const bcryptSalt = bcrypt.genSaltSync(4);

const jwtSecret = "13941fiewq4031fnidsu301984091hjfdsif";

const app = express();

app.use("/uploads", express.static(__dirname + "/uploads"));
// env files
dotenv.config();

// parse json
app.use(express.json());

// parse cookies
app.use(cookieParser());

// cors
app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173",
  })
);

// db
mongoose.set("strictQuery", false).connect(process.env.MONGO_URI);

// routes

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(user);
  } catch (error) {
    res.status(402).json(error);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //   Validations
  const user = await User.findOne({ email: email });

  if (user) {
    const passwordMatches = bcrypt.compareSync(password, user.password);
    if (passwordMatches) {
      jwt.sign(
        { email: user.email, id: user._id },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    } else {
      res.status(422).json("Password no coincide");
    }
  } else {
    res.json("email not found");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
      if (err) throw err;
      // const userDocument = await User.findById(cookieData.id);
      const { name, email, _id } = await User.findById(cookieData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

const imgMiddleware = multer({ dest: "uploads/" });

app.post("/upload", imgMiddleware.array("photos", 100), (req, res) => {
  // files are uploading to our server with no extensio, so we are unable to see nothing..
  // let's rename the path so we add it a extension
  const imagesArray = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const extension = parts[parts.length - 1];
    const newPath = path + "." + extension;

    fs.renameSync(path, newPath);
    imagesArray.push(newPath.replace("uploads/", ""));
  }

  console.log(req.files);
  console.log(imagesArray);
  res.json(req.files);
});

app.listen(4000);
