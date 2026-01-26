import express, { Router } from 'express';
import authController from '../controllers/authController.js';
import ownerController from '../controllers/ownerController.js';
import playerController from '../controllers/playerController.js';
import teamController from '../controllers/teamController.js';
import { registerSchema, loginSchema, playerRegisterSchema, teamRegisterSchema } from '../validators/authValidation.js'
import validator from '../middlewares/formValidator.js';
import { requireAdminAuth, requireOwnerAuth } from "../middlewares/authMiddleware.js";
import csrfProtection from '../middlewares/csrfProtection.js';
import blockInProduction from '../middlewares/productionBlock.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = Router();

const parseCsrf = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};



// 2. ADMIN SIGN IN
router.get('/admin/signin', csrfProtection, parseCsrf, authController.renderSignin);
router.post('/admin/signin', csrfProtection, parseCsrf, validator(loginSchema, 'adminSignin'), authController.handleSignin);
// 3. ADMIN SIGN OUT 
router.post('/admin/signout', requireAdminAuth, authController.handleSignout);




// 1. OWNER REGISTER
router.get('/owner/register', requireAdminAuth, ownerController.renderRegister);
router.post('/owner/register', requireAdminAuth, upload.single('image'), validator(registerSchema), ownerController.handleRegister);

// 2. OWNER SIGN IN
router.get('/owner/signin', ownerController.renderSignin);
router.post('/owner/signin', validator(loginSchema, 'ownerSignin'), ownerController.handleSignin);

// 3. OWNER SIGN OUT 
router.post('/owner/signout', requireOwnerAuth, authController.handleSignout);


// 1. PLAYER REGISTER
router.get('/player/register', requireAdminAuth, playerController.renderRegister);
router.post('/player/register', requireAdminAuth, upload.single('playerImage'), validator(playerRegisterSchema), playerController.handleRegister);



//1. TEAM REGISTER
router.get('/team/register', requireAdminAuth, teamController.renderRegister);
router.post('/team/register', requireAdminAuth, upload.single('teamLogo'), validator(teamRegisterSchema), teamController.handleRegister);

export default router;