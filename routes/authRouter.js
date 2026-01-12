import express,{Router} from 'express';
import authController from '../controllers/authController.js';
import {registerSchema,loginSchema} from '../validators/authValidation.js'
import validator from '../middlewares/formValidator.js';
const requireAuth = require("../middleware/authMiddleware");

const router = Router();


// 1. ADMIN REGISTER
router.get('/admin/register', authController.renderRegister);
router.post('/admin/register', validator(registerSchema, 'adminRegister'), authController.handleRegister);

// 2. ADMIN SIGN IN
router.get('/admin/signin', authController.renderSignin);
router.post('/admin/signin', validator(loginSchema, 'adminSignin'), authController.handleSignin);
// 3. ADMIN SIGN OUT 
router.post('/admin/signout', authController.handleSignout);

// 4. ADMIN PASSWORD RESET
router.get('/admin/forget-password', authController.renderForgetPassword);
router.post('/admin/forget-password', authController.handleForgetPassword);

router.get('/admin/reset-password', authController.renderResetPassword);
router.post('/admin/reset-password', authController.handleResetPassword);


// 5. ADMIN PROFILE MANAGEMENT
router.patch('/admin/profile', authController.handleUpdateProfile);
router.delete('/admin/profile', authController.handleDeleteProfile);

// 6. ADMIN DASHBOARD
router.get('admin/dashboard',requireAuth, authController.renderDashboard); 



// 1. OWNER REGISTER
router.get('/register', authController.renderRegister);
router.post('/register', validator(registerSchema), authController.handleRegister);

// 2. OWNER SIGN IN
router.get('/signin', authController.renderSignin);
router.post('/signin', authController.handleSignin);

// 3. OWNER SIGN OUT 
router.post('/signout', authController.handleSignout);

// 4. OWNER PASSWORD RESET
router.get('/forget-password', authController.renderForgetPassword);
router.post('/forget-password', authController.handleForgetPassword);

router.get('/reset-password', authController.renderResetPassword);
router.post('/reset-password', authController.handleResetPassword);


// 5. USER PROFILE MANAGEMENT
router.patch('/profile', authController.handleUpdateProfile);
router.delete('/profile', authController.handleDeleteProfile);



export default router;