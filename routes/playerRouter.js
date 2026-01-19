import express,{Router} from 'express';
import playerController from '../controllers/playerController.js';
import {requireOwnerAuth, requireAdminAuth, requireAdminOrOwner} from "../middlewares/authMiddleware.js";
const router = Router();


router.get('/playerslist', requireAdminOrOwner, playerController.renderAllPlayers);
router.get('/profile/:id', requireAdminOrOwner, playerController.renderPlayerProfile);
// router.get('/profile/delete/:id', requireAdminOrOwner, playerController.renderDelete);
// router.post('/profile/delete/:id', requireAdminOrOwner, playerController.handleDelete);
router.get('/profile/edit/:id', requireAdminAuth, playerController.renderEdit);
// router.post('/profile/edit/:id', requireAdminOrOwner, playerController.handleEdit);
export default router;