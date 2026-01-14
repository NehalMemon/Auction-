import express from "express";
import dotenv from "dotenv";
import path from "path";
import indexroute from "./routes/indexRoute.js";
import { fileURLToPath } from "url";
import "./config/config.js";
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from "cookie-parser";




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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
