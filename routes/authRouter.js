import express,{Router} from 'express';
import authController from '../controllers/authController.js';
import ownerController from '../controllers/ownerController.js';
import playerController from '../controllers/playerController.js';
import {registerSchema, loginSchema, playerRegisterSchema} from '../validators/authValidation.js'
import validator from '../middlewares/formValidator.js';
import { requireAdminAuth } from "../middlewares/authMiddleware.js";
import csrfProtection from '../middlewares/csrfProtection.js';
import blockInProduction from '../middlewares/productionBlock.js';

const router = Router();

const parseCsrf = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};

// 1. ADMIN REGISTER
router.get('/admin/register',blockInProduction, csrfProtection,parseCsrf, authController.renderRegister);
router.post('/admin/register',blockInProduction,csrfProtection,parseCsrf, validator(registerSchema, 'adminRegister'), authController.handleRegister);

// 2. ADMIN SIGN IN
router.get('/admin/signin',csrfProtection,parseCsrf, authController.renderSignin);
router.post('/admin/signin', csrfProtection,parseCsrf, validator(loginSchema, 'adminSignin'), authController.handleSignin);
// 3. ADMIN SIGN OUT 
router.post('/admin/signout',requireAdminAuth, authController.handleSignout);

// 4. ADMIN PASSWORD RESET
router.get('/admin/forget-password', authController.renderForgetPassword);
router.post('/admin/forget-password', authController.handleForgetPassword);

router.get('/admin/reset-password', authController.renderResetPassword);
router.post('/admin/reset-password', authController.handleResetPassword);



// 1. OWNER REGISTER
router.get('/owner/register',requireAdminAuth, ownerController.renderRegister);
router.post('/owner/register', requireAdminAuth, validator(registerSchema), ownerController.handleRegister);

// 2. OWNER SIGN IN
router.get('/owner/signin', ownerController.renderSignin);
router.post('/owner/signin', ownerController.handleSignin);

// // 3. OWNER SIGN OUT 
// router.post('/owner/signout', authController.handleSignout);

// // 4. OWNER PASSWORD RESET
// router.get('/owner/forget-password', authController.renderForgetPassword);
// router.post('/owner/forget-password', authController.handleForgetPassword);
// router.get('/reset-password', authController.renderResetPassword);
// router.post('/reset-password', authController.handleResetPassword);


// // 6. OWNER DASHBOARD
// router.get('/owner/dashboard',adminOrOwner, authController.renderDashboard);


// 1. PLAYER REGISTER
router.get('/player/register',requireAdminAuth, playerController.renderRegister);
router.post('/player/register', requireAdminAuth, validator(playerRegisterSchema), playerController.handleRegister);


export default router;