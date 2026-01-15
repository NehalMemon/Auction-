import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import Owner from "../models/ownerModel.js";
import authController from "../controllers/authController.js";
import ownerController from "../controllers/ownerController.js";

export const requireAdminAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  // 1️⃣ If access token exists, verify it
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const admin = await Admin.findByPk(decoded.id);

      if (!admin) {
        // access token valid but admin not found → redirect to login
        return res.redirect(`/auth/admin/signin?redirect=${encodeURIComponent(req.originalUrl)}`);
      }

      // attach admin to request
      req.user = admin;
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

export const requireOwnerAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  // 1️⃣ If access token exists, verify it
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const owner = await Owner.findByPk(decoded.id);

      if (!owner) {
        // access token valid but owner not found → redirect to login
        return res.redirect(`/auth/owner/signin?redirect=${encodeURIComponent(req.originalUrl)}`);
      }

      // attach owner to request
      req.user = owner;
      return next();

    } catch (err) {
      // access token expired/invalid → fallback to refresh token
      console.log("Access token expired/invalid, calling refreshToken controller");
      return ownerController.refreshToken(req, res, req.originalUrl); // pass original URL
    }
  }

  // 2️⃣ No access token → call refresh token controller
  return ownerController.refreshToken(req, res, req.originalUrl);
};

export const requireAdminOrOwner = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        // If no token, we don't know who they are, send to generic login or admin login
        return res.redirect('/auth/owner/signin');
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        // 1. Check if Admin
        const admin = await Admin.findByPk(decoded.id);
        if (admin) {
            req.user = admin;
            req.userType = 'admin'; // Useful helper flag
            return next();
        }

        // 2. Check if Owner
        const owner = await Owner.findByPk(decoded.id);
        if (owner) {
            req.user = owner; // Or req.user = owner
            req.userType = 'owner';
            return next();
        }

        // 3. Valid token, but user not found in either table
        return res.redirect('/auth/admin/signin');

    } catch (err) {
        console.log("Token invalid in hybrid check");
        // For simplicity, just redirect to login on error
        return res.redirect('/auth/admin/signin');
    }
};

