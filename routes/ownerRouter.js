import express,{Router} from 'express';
import ownerController from '../controllers/ownerController.js';
import {requireOwnerAuth, requireAdminAuth, requireAdminOrOwner} from "../middlewares/authMiddleware.js";
const router = Router();


router.get('/dashboard', requireOwnerAuth, ownerController.renderDashboard);
router.get('/ownerslist', requireAdminOrOwner, ownerController.renderAllOwners);
router.get('/profile/:id', requireAdminOrOwner, ownerController.renderOwnerProfile);
router.post('/delete', requireOwnerAuth, ownerController.renderAllOwners);



export default router;