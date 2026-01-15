import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import authController from "../controllers/authController";

const requireAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  // 1️⃣ If access token exists, verify it
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const admin = await Admin.findByPk(decoded.id);

      if (!admin) {
        // access token valid but admin not found → redirect to login
        return res.redirect(`/api/auth/admin/signin?redirect=${encodeURIComponent(req.originalUrl)}`);
      }

      // attach admin to request
      req.admin = admin;
      return next();

    } catch (err) {
      // access token expired/invalid → fallback to refresh token
      console.log("Access token expired/invalid, calling refreshToken controller");
      return authController.refreshToken(req, res, req.originalUrl); // pass original URL
    }
  }

  // 2️⃣ No access token → call refresh token controller
  return authController.refreshToken(req, res, req.originalUrl);
};

export default requireAuth;
