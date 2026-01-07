import express from "express";
import dotenv from "dotenv";
import path from "path";
import indexroute from "./routes/indexRoute.js";
import { fileURLToPath } from "url"; // 1. Import this
import "./config/config.js";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexroute);

app.get("/admin/signup", (req, res) => res.render("admin-signup"));
app.get("/admin/signin/video", (req, res) => res.render("admin-signin-video"));
app.get("/admin/signup/video", (req, res) => res.render("admin-signup-video"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
