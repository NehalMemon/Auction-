import express,{Router} from 'express';
import teamController from '../controllers/teamController.js';
import {requireOwnerAuth, requireAdminAuth, requireAdminOrOwner} from "../middlewares/authMiddleware.js";
import upload from '../middlewares/uploadMiddleware.js';
import validator from '../middlewares/formValidator.js';
import {registerSchema, loginSchema, playerRegisterSchema} from '../validators/authValidation.js'
const router = Router();

router.get('/teamslist', requireAdminOrOwner, teamController.renderAllTeams);


export default router;