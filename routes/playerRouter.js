import express,{Router} from 'express';
import playerController from '../controllers/playerController.js';
import {requireOwnerAuth, requireAdminAuth, requireAdminOrOwner} from "../middlewares/authMiddleware.js";
const router = Router();


router.get('/playerslist', requireAdminOrOwner, playerController.renderAllPlayers);
export default router;