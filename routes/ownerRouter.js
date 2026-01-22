import express,{Router} from 'express';
import ownerController from '../controllers/ownerController.js';
import {requireOwnerAuth, requireAdminAuth, requireAdminOrOwner} from "../middlewares/authMiddleware.js";
import validator from "../middlewares/formValidator.js"
import { updateOwnerSchema } from '../validators/authValidation.js';
import upload from '../middlewares/uploadMiddleware.js';
const router = Router();


router.get('/dashboard', requireOwnerAuth, ownerController.renderDashboard);
router.get('/ownerslist', requireAdminOrOwner, ownerController.renderAllOwners);
router.get('/profile/:id', requireAdminOrOwner, ownerController.renderOwnerProfile);
router.post('/profile/delete/:id', requireAdminAuth, ownerController.handleDelete);
router.get('/profile/edit/:id', requireAdminAuth, ownerController.renderEdit);
router.post('/profile/edit/:id', requireAdminAuth, upload.single('image'), validator(updateOwnerSchema), ownerController.handleEdit);



export default router;