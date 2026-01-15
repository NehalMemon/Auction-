import express from "express";
import dotenv from "dotenv";
import path from "path";
import indexroute from "./routes/indexRoute.js";
import { fileURLToPath } from "url";
import "./config/config.js";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import fs from "fs";
=======
>>>>>>> origin/nehal
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from "cookie-parser";



>>>>>>> f61b1319338224c5ad6064c8e274139ec7fdc29d

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use(
  session({
    name: "ui.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    rolling: false,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 60 * 1000 // short lifetime
    }
  })
);



app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    // Also pass the user/admin info if logged in (optional but useful)
    next(); 
});




app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
  next();
});


app.set("view engine", "ejs");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));


<<<<<<< HEAD
<<<<<<< HEAD
// suraish code starts ---------------------------------------------------
app.get("/admin/signin", (req, res) => res.render("admin-signin"));
=======
// app.get("/admin/signup", (req, res) => res.render("admin-signup"));
// app.get("/admin/signin/video", (req, res) => res.render("admin-signin-video"));
// app.get("/admin/signup/video", (req, res) => res.render("admin-signup-video"));
>>>>>>> f61b1319338224c5ad6064c8e274139ec7fdc29d
=======
app.use("/", indexroute);


// CSRF Error Handler (VERY IMPORTANT)
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    req.flash("error", "Form expired or invalid CSRF token");
    const backURL = req.get("Referrer") || "/auth/admin/signin";
    return res.redirect(backURL);
  }
  next(err);
});
>>>>>>> origin/nehal

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
