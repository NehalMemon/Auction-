import express,{Router} from 'express';
import authController from '../controllers/authController.js';
import registerSchema from '../validators/authValidation.js'
import validator from '../middlewares/formValidator.js';

const router = Router();

router.post('/register',validator(registerSchema),authController.registerPost);
router.post('/signin',authController.signinPost);
router.post('/signout',authController.signuotPost);
router.post('/forget-password',authController.forgetPasswordPost)
router.post('/reset-password',authController.resetPasswordPost)


router.get('/register',authController.registerGet);
router.get('/signin',authController.signinGet);
router.get('/forget-password',authController.forgetPasswordGet);
router.get('/reset-password',authController.resetPasswordGet);

router.patch('/profile',authController.updatePatch);
router.delete('/profile',authController.deleteDelete);

export default router;