import express,{Router} from 'express';
import authController from '../controllers/authController.js';

const router = Router();

router.post('/register',authController.signupPost);
router.post('/signin',authController.signinPost);
router.post('/signout',authController.signuotPost);
router.post('/forget-password',authController.forgetPost)







router.get('/signup',authController.signupGet);
router.get('/signin',authController.signinGet);
router.patch('/update/:id',authController.updatePatch);
router.delete('/delete/:id',authController.deleteDelete);
router.get('/forget/:id',authController.forgetGet);

export default router;