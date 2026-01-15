import express from "express";
import dotenv from "dotenv";
import path from "path";
import indexroute from "./routes/indexRoute.js";
import { fileURLToPath } from "url"; // 1. Import this
import "./config/config.js";
<<<<<<< HEAD
=======
import fs from "fs";
import session from 'express-session';
import flash from 'connect-flash';


>>>>>>> f61b1319338224c5ad6064c8e274139ec7fdc29d

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
    secret: 'my_secret_key', // Change this to a random string
    resave: false,
    saveUninitialized: false
}));

// 2. Setup Flash
app.use(flash());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexroute);

<<<<<<< HEAD
// suraish code starts ---------------------------------------------------
app.get("/admin/signin", (req, res) => res.render("admin-signin"));
=======
// app.get("/admin/signup", (req, res) => res.render("admin-signup"));
// app.get("/admin/signin/video", (req, res) => res.render("admin-signin-video"));
// app.get("/admin/signup/video", (req, res) => res.render("admin-signup-video"));
>>>>>>> f61b1319338224c5ad6064c8e274139ec7fdc29d

app.get("/admin/register", (req, res) => res.render("admin-register"));

app.get("/addPlayer", (req, res) => {
  res.render("addPlayer");
});

app.get("/addOwner", (req, res) => {
  res.render("addOwner", { error: "Email already exists" });
});

// suraish code starts ---------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
