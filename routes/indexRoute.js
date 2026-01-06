import express,{Router} from 'express';
import authController from '../controllers/authController.js';
import authRouter from './authRouter.js';
import ownerRouter from './ownerRouter.js';
import playerRouter from './playerRouter.js';
import teamRouter from './teamRouter.js';

const router = Router();


router.get('/',authController.greet);

export default router;