import express from "express";
import dotenv from "dotenv";
import path from "path";
import indexroute from "./routes/indexRoute.js";
import { fileURLToPath } from "url";
import "./config/config.js";
import session from 'express-session';
import flash from 'connect-flash';
import cookieParser from "cookie-parser";
import currentPath from "./middlewares/currentPath.js" 
import db from './models/index.js'; 

// 2. Destructure the models you need
const { Team, Owner } = db;





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



app.use(currentPath); // suraish add this middleware.
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


// (async () => {
//     try {
//         const team = await Team.findOne({
//             where: { id: 1 },
//             include: [{ model: Owner,
//               as: 'owner'
//              }] 
//         });

//         if (team) {
        
//           console.log(team.owner.toJSON());


//             if (team.owner) {
//                 console.log("Owner Name:", team.owner.name);
//                 console.log("Owner Email:", team.owner.email);
//             } else {
//                 console.log("This team has no owner assigned.");
//             }
//         } else {
//             console.log("Team not found!");
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }
// })();



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
